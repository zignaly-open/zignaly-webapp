import styled from "styled-components";

export const Layout = styled.div`
  h1 {
    margin-bottom: 16px;
  }
`;

export const SideButtons = styled.div`
  display: flex;

  button > div > div,
  svg {
    width: 40px !important;
    height: 40px !important;
  }

  > div + div {
    margin-left: 12px;
  }
`;
