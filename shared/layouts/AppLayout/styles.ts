// Dependencies
import styled from "styled-components";
import { styledIf } from "../../utils/styled";

export const Layout = styled.main``;

export const Container = styled.div`
  padding-top: 52px;
`;

export const Navigation = styled.nav`
  display: flex;
  gap: 22px;
`;

export const NavLink = styled.a<{active?: boolean}>`
  color: #706f82;
  font-weight: 500;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0.55px;
  text-decoration: none;
  cursor: pointer;
  transition: 0.15s linear;

  &:hover {
    color: #fff;
  }

  ${({active}) => (`
    ${styledIf(active, `
      color: #7682f7;
    `)}
  `)}
`;

export const DropDownContainer = styled.div`
  padding: 22px;
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;

  border-bottom: 1px solid #2c2d59;
  padding: 12px 0;
  gap: 8px;


  &:first-child {
    padding-top: 0;
  }

  &.last {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const Bold = styled.b``;

export const Networks = styled.div`
  display: grid;
  grid-template-columns: repeat(6,minmax(0%, 100%));
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding-top: 22px;

  span svg {
    fill: #707185;
    color: #707185;
    transition: all 0.15s linear;
  }

  ${NavLink}:hover {
    span svg {
      fill: #fff;
      color: #fff;
    }
  }
`;
