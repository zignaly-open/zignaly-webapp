// Dependencies
import styled from "styled-components";

type ModalContainerTypeProps = {
  theme: any,
  width: string | number;
  padding?: string;
}
export const ModalContainer = styled.div<ModalContainerTypeProps>`
  border-radius: 12px;
  box-shadow: 0 12px 11px #0000000f;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  color: #FBFBFD;
  background: #0d3a52ff;
  background: -moz-linear-gradient(-45deg, #0d3a52ff 0%, #101233ff 100%);
  background: -webkit-linear-gradient(-45deg, #0d3a52ff 0%, #101233ff 100%);
  background: linear-gradient(135deg, #0d3a52ff 0%, #101233ff 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#0d3a52ff', endColorstr='#101233ff',GradientType=1);

  ${({ width, padding }) => `
    width: ${width};
    padding: ${padding ?? "3rem"};
  `};
  user-select: none;
`;

export const Title = styled.h3`
  text-align: center;
  font-size: 16px;
  color: #e1e4e7;
`;

type BodyTypeProps = {
  textAlign?: string;
}
export const Body = styled.div<BodyTypeProps>`
  text-align: ${props => props.textAlign ?? "center"};
  font-size: 14px;
  color: #99a7bb;
`;

type ActionsTypeProps = {
  columns: number | string;
}
export const Actions = styled.div<ActionsTypeProps>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, minmax(0%, 100%));
  grid-column-gap: 22px;
  grid-row-gap: 22px;
  margin-top: 3rem;
  width: 100%;
`;
