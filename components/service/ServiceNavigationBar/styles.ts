import styled from "styled-components";

export const Layout = styled.div`
  height: 56px;
  margin-bottom: 88px;
  display: flex;
  align-items: center;

  a {
    width: 230px;
    text-decoration: none;

    &.active {
      color: white;
    }
  }
`;
