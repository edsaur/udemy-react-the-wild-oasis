import styled, { css } from "styled-components";

const Heading = styled.h1`
${props => props.as === 'h1' && css`
    font-size: 5.5rem;
    font-weight: 600;
    text-transform: uppercase;`}


${props => props.as === 'h2' && css`
    font-size: 3rem;
    font-weight: 600;
    text-transform: uppercase;`}

${props => props.as === 'h3' && css`
    font-size: 2.5rem;
    font-weight: 600;
    text-transform: uppercase;`}

    line-height: 1.4;
`;

export default Heading;