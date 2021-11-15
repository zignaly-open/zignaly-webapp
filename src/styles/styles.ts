import styled from "styled-components";
import { Box, Typography } from "@material-ui/core";

export const isMobile = (query) => {
  return `@media screen and (min-width: 0px) and (max-width: 990px) { ${query} }`;
};

export const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 1px;
  margin-bottom: 21px;
  text-transform: uppercase;

  img {
    margin-right: 4px;
  }
`;

export const SubTitle = styled(Typography)`
  color: #65647e;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.33px;
  line-height: 16px;
  margin-bottom: 20px;
`;

export const Panel = styled(Box)`
  border-radius: 16px;
  ${({ theme }) => `
    border: 1px solid ${theme.newTheme.borderColor};
    background-color: ${theme.newTheme.backgroundColor};
  `}
`;

export const Modal = styled(Box)`
  /* background: ${({ theme }) => (theme.palette.type === "dark" ? "#0C0D21" : "#E4E3F4")}; */
  /* border: 1px solid ${({ theme }) => (theme.palette.type === "dark" ? "#413BA0" : "#A586DF")}; */
  /* border-radius: 16px; */
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
`;

export const TextDesc = styled(Typography)`
  /* color: #f3f4f6; */
  font-size: 16px;
  letter-spacing: 0.33px;
  /* line-height: 20px; */
  margin-bottom: 64px;

  ${isMobile(`
    margin-bottom: 32px;
  `)}
`;

export const Label = styled(Typography)`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 4px;
`;

export const AlignCenter = styled.div`
  display: flex;
  align-items: ${(props) => props.alignItems || "center"};
  justify-content: ${(props) => props.justifyContent || "center"};
  flex-direction: ${(props) => props.direction || "row"};
`;
