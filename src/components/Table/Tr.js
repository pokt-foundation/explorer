import styled, { css } from "styled-components";
import { maxPhone, maxTablet } from "../../utils/media";

const Tr = styled.tr`
    position: relative;
    width: 100%;
    transform: scale(1);
    &:after {
        content: '';
        display: block;
        margin: auto;
        position: absolute;
        bottom: 0;
        height: 1px;
        background: #f5f5f5;
        left: 50%;
        .two-tables-container & {
            margin-left: -46%;
            width: 92%;
            ${maxTablet(css`
                margin-left: -47.25%;
                width: 94.5%;
            `)};
        }
        .one-table-container & {
            margin-left: -48.25%;
            width: 96.5%;
            ${maxTablet(css`
                margin-left: -47.5%;
                width: 95%;
            `)};
            ${maxPhone(css`
                margin-left: -48.25%;
                width: 96.5%;
            `)};
        }
        .details-t &,
        .additional-i & {
            margin-left: -48.25%;
            width: 96.5%;
            ${maxTablet(css`
                margin-left: -47.5%;
                width: 95%;
            `)};
        }
    }
    .details-t &,
    .additional-i & {
        &:last-child {
            &:after {
                height: 0;
            }
        }
    }
`;

export default Tr;