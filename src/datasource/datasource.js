/* global BigInt */

import {
    Pocket,
    PocketRpcProvider,
    typeGuard,
    RpcError,
    PocketAAT,
    StakingStatus,
} from "@pokt-network/pocket-js/dist/web.js"
import { Account, Transaction, Block } from "../models"
import { OCAlert } from '@opuscapita/react-alerts';


export class DataSource {
    static instance = DataSource.instance || new DataSource([new URL(process.env.REACT_APP_POCKET_URL)])

    constructor(dispatchers) {
        this.dispatchers = dispatchers
    }

    async getPocketInstance() {
        if (!this.pocket || !this.pocket.rpc()) {

            const pocketPrivateKey = process.env.REACT_APP_POCKET_PRIVATE_KEY
            const pocketPublicKey = process.env.REACT_APP_POCKET_PUBLIC_KEY
            const pocketAddress = process.env.REACT_APP_POCKET_ADDRESS
            const pocketPassphrase = process.env.REACT_APP_POCKET_PASSPHRASE

            this.blockchain = process.env.REACT_APP_POCKET_CHAIN
            this.pocket = new Pocket(this.dispatchers)

            await this.pocket.keybase.importAccount(Buffer.from(pocketPrivateKey, 'hex'), pocketPassphrase)
            await this.pocket.keybase.unlockAccount(pocketAddress, pocketPassphrase, 0)


            const aat = await PocketAAT.from(
                "0.0.1",
                pocketPublicKey,
                pocketPublicKey,
                pocketPrivateKey
            )
            const pocketRpcProvider = new PocketRpcProvider(
                this.pocket,
                aat,
                this.blockchain
            )

            this.pocket.rpc(pocketRpcProvider)
        }
        return this.pocket
    }

    /**
     * @returns {BigInt}
     */
    async getHeight() {
        const pocket = await this.getPocketInstance()
        const heightResponseOrError = await pocket.rpc().query.getHeight()
        if (typeGuard(heightResponseOrError, RpcError)) {
            OCAlert.alertError(heightResponseOrError.message, { timeOut: 3000 });
            return undefined
        } else {
            return heightResponseOrError.height
        }
    }

    /**
     *
     * @param {string} id
     * @returns {Account}
     */
    async getAccount(id) {
        const pocket = await this.getPocketInstance()
        const accountOrError = await pocket.rpc().query.getAccount(id)
        if (typeGuard(accountOrError, RpcError)) {
            OCAlert.alertError(accountOrError.message, { timeOut: 3000 });
            return undefined
        } else {
            return new Account(accountOrError.address, accountOrError.toJSON())
        }
    }

    /**
     *
     * @param {string} id
     */
    async getTransaction(id) {
        const pocket = await this.getPocketInstance()
        const txResponseOrError = await pocket.rpc().query.getTX(id)
        if (typeGuard(txResponseOrError, RpcError)) {
            OCAlert.alertError(txResponseOrError.message, { timeOut: 3000 });
            return undefined
        } else {
            const pocketTx = txResponseOrError.transaction
            return new Transaction(
                pocketTx.hash,
                pocketTx.height,
                undefined,
                pocketTx.toJSON()
            )
        }
    }

    /**
     *
     * @param {string} id
     * @returns {Block}
     */
    async getBlock(height) {
        const pocket = await this.getPocketInstance()
        const blockResponseOrError = await pocket.rpc().query.getBlock(BigInt(height))
        if (typeGuard(blockResponseOrError, RpcError)) {
            OCAlert.alertError(blockResponseOrError.message, { timeOut: 3000 });
            return undefined
        } else {
            const block = blockResponseOrError.block
            const blockMeta = blockResponseOrError.blockMeta
            return new Block(
                blockMeta.blockID.hash,
                block.header.height.toString(),
                block.header.time,
                blockResponseOrError.toJSON()
            )
        }
    }

    /**
     *
     * @param {number} count How many blocks to fetch
     */
    async getLatestBlocks(count) {
        if (count === 0 || count === undefined) {
            return []
        }
        const height = await this.getHeight()
        if (height === undefined) {
            return [
                new Block(
                    "test_hash",
                    "10",
                    "1321231",
                    {}
                )
            ]
        }
        let currHeight = height
        const result = []
        for (let index = count; index > 0; --index) {
            const block = await this.getBlock(currHeight)
            result.push(block)
            currHeight = currHeight - 1
        }
        return result
    }

    /**
     *
     * @param {BigInt} height of the block to get the transactions from
     * @param {number} page
     * @param {number} perPage
     */
    async getLatestTransactions(page, perPage) {
        const pocket = await this.getPocketInstance()
        const result = []
        const height = await this.getHeight()
        if (height === undefined) {
            return []
        }
        const blockTxsResponseOrError = await pocket.rpc.query.getBlockTxs(
            height,
            false,
            page,
            perPage
        )
        if (typeGuard(blockTxsResponseOrError(blockTxsResponseOrError, RpcError))) {
            OCAlert.alertError(blockTxsResponseOrError.message, { timeOut: 3000 });
            return result
        }
        blockTxsResponseOrError.resultTx.forEach(element => {
            result.push(
                new Transaction(
                    element.hash,
                    element.height,
                    undefined,
                    element.toJSON()
                )
            )
        })
        return result
    }

    async getTotalStakedApps() {
        const pocket = await this.getPocketInstance()
        const height = await this.getHeight()
        if (height === undefined) {
            return []
        }
        const appsResponseOrError = await pocket.rpc().query.getApps(StakingStatus.Staked, height, this.blockchain, 1, 10)
        if (typeGuard(appsResponseOrError, RpcError)) {
            OCAlert.alertError(appsResponseOrError.message, { timeOut: 3000 });
            return 0
        } else {
            return appsResponseOrError.applications.length
        }
    }

    async getBalance() {
        const pocket = await this.getPocketInstance()
        const pocketAddress = process.env.REACT_APP_POCKET_ADDRESS
        const queryBalanceResponseOrError = await pocket.rpc().query.getBalance(pocketAddress)
        if (typeGuard(queryBalanceResponseOrError, RpcError)) {
            OCAlert.alertError(queryBalanceResponseOrError.message, { timeOut: 3000 });
            return 0
        } else {
            return queryBalanceResponseOrError.balance
        }
    }

    async getNodes() {
        const pocket = await this.getPocketInstance()
        const validatorsResponseOrError = await pocket.rpc().query.getValidators(StakingStatus.Staked)
        if (typeGuard(validatorsResponseOrError, RpcError)) {
            OCAlert.alertError(validatorsResponseOrError.message, { timeOut: 3000 });
            return 0
        } else {
            return validatorsResponseOrError.balance
        }
    }
}
