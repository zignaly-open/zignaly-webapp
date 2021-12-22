import React from "react";
import { FormControl, Select as SelectMui, MenuItem } from "@material-ui/core";
import styled, { css } from "styled-components";

const StyledSelect = styled(SelectMui)<{ customVariant: string }>`
  ${({ theme }) => css`
    background: ${theme.palette.type === "dark"
      ? "rgba(12, 13, 33, 0.8)"
      : "linear-gradient(312.12deg, #41BDD8 14.16%, #7568DE 83.59%)"};
    color: ${theme.palette.type === "dark"
      ? theme.newTheme.neutralText
      : theme.newTheme.neutralText5};
    font-weight: 600;
    position: relative;
    border: 1px solid ${theme.palette.type === "dark" ? "#413BA0" : "#9CA3AF"};

    svg {
      color: "#9CA3AF";
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

interface FilterValue {
  value: string | number;
  label: string;
}

interface ISelect {
  values: FilterValue[];
  value: string | number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
  variant?: "default" | "rainbow";
}

const Select = ({ values, value, handleChange, fullWidth, variant }: ISelect) => {
  return (
    <FormControl variant="filled" hiddenLabel={true} fullWidth={fullWidth}>
      <StyledSelect
        disableUnderline
        value={value}
        onChange={handleChange}
        fullWidth={fullWidth}
        customVariant={variant}
      >
        {values.map((v) => (
          <MenuItem key={v.value} value={v.value}>
            {v.label}
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
};
export default Select;
