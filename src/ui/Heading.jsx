import styled, { css } from "styled-components";

// const test = css`
//   text-align: center;
//   ${10 > 5 && "background-color: yellow"}
// `;

export const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      margin: 0;
    `}
  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
    `}
  ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 1rem;
      font-weight: 500;
      margin: 0;
    `}
  ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
      margin: 0;
    `}
  color: var(--color-grey-700);
  line-height: 1.4;
`;
export default Heading;
