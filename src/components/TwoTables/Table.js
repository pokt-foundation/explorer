import styled, { css } from "styled-components";
import { colors } from '../../utils/colors';
import { maxPhone, tablet, maxTablet, tabletLandscape, desktop } from "../../utils/media";

const T = styled.table`
    border-collapse: collapse;
    border-radius: 12px;
    box-shadow: 0 6px 25px -8px rgba(0, 0, 0, 0.23);
    background-color: ${colors.white};
    ${maxPhone(css`
        width: 100%;
    `)};
    ${tablet(css`
        width: 100%;
    `)};
    ${tabletLandscape(css`
        width: 100%;
    `)};
    ${desktop(css`
        flex-basis: calc(50% - 10px);
        flex-grow: 0;
        flex-shrink: 0;
        width: calc(50% - 10px); 
    `)};
    &:nth-child(odd) {
        ${desktop(css`
            margin: 0 30px 0 0;
        `)};
    }
    .two-tables-container & {
        ${tabletLandscape(css`
            margin-top: 50px;
        `)};
        ${maxTablet(css`
            margin-top: 30px;
        `)};
    }
`;


export default T;