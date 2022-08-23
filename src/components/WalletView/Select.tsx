import React, { ReactElement } from "react";
import { FormControl, Select as SelectMui, MenuItem } from "@material-ui/core";
import styled, { css } from "styled-components";

const StyledSelect = styled(SelectMui)<{ customVariant: string }>`
  ${({ theme, fullWidth }) => css`
    background: ${theme.palette.type === "dark" ? "#0C0D21" : "#ffffff"};
    color: ${theme.palette.type === "dark" ? theme.newTheme.neutralText : "#0C0D21"};
    position: relative;
    border: 1px solid ${theme.newTheme.borderColor2};
    height: ${fullWidth ? "72px" : "40px"};
    font-size: 18px;
    font-weight: 600;

    .MuiSelect-selectMenu {
      display: flex;
      align-items: center;
    }

    svg {
      color: #9ca3af;
      ${fullWidth &&
      css`
        height: 40px;
        width: 40px;
        top: calc(50% - 20px);
        margin-right: 10px;
      `};
    }
  `}

  ${({ theme, customVariant }) =>
    customVariant === "rainbow" &&
    css`
      z-index: 0;
      font-size: 13px;
      border-radius: 4px;
      border: none;
      color: ${theme.palette.type === "dark" ? theme.newTheme.neutralText : "white"};
      background: ${theme.palette.type === "dark"
        ? "rgba(12, 13, 33, 0.8)"
        : "linear-gradient(312.12deg, #41BDD8 14.16%, #7568DE 83.59%)"};

      svg {
        color: ${theme.palette.type === "dark" ? theme.newTheme.neutralText : "white"};
      }

      &:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: inherit;
        padding: 1px;
        background: ${theme.palette.type === "dark"
          ? "linear-gradient(289.8deg, #149cad 0%, #4540c1 100%)"
          : "linear-gradient(289.8deg, #817cce 0%, #779fd4 100%)"};
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        z-index: -1;
      }
    `}
`;

const Icon = styled.img`
  margin: 0 22px 0 10px;
`;

interface FilterValue {
  value: string | number;
  label: string;
  icon?: any;
}

interface ISelect {
  values: FilterValue[] | FilterValue["value"][];
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  variant?: "default" | "rainbow";
  id?: string;
}

const Select = ({ values, value, handleChange, fullWidth, variant, id }: ISelect) => {
  return (
    <FormControl variant="filled" hiddenLabel={true} fullWidth={fullWidth}>
      <StyledSelect
        disableUnderline
        value={value}
        onChange={handleChange}
        fullWidth={fullWidth}
        customVariant={variant}
        id={id}
      >
        {values.map((v) => (
          <MenuItem
            key={typeof v === "object" ? v.value : v}
            value={typeof v === "object" ? v.value : v}
          >
            {typeof v === "object" && v.icon && <Icon width={40} height={40} src={v.icon} />}
            {typeof v === "object" ? v.label : v}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};
export default Select;
