import React from "react";
import { FormControl, Select as SelectMui, MenuItem } from "@material-ui/core";
import styled from "styled-components";

const StyledSelect = styled(SelectMui)`
  background: rgba(12, 13, 33, 0.8);
  border-radius: 4px;
  color: ${(props) => props.theme.newTheme.neutralText};
  font-weight: 600;
  font-size: 13px;
  position: relative;
  z-index: 0;
  margin-left: 18px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
`;

interface FilterValue {
  value: string | number;
  label: string;
}

interface ISelect {
  values: FilterValue[];
  value: string | number;
  handleChange: () => void;
}

const Select = ({ values, value, handleChange }: ISelect) => {
  return (
    <FormControl variant="filled" hiddenLabel={true}>
      <StyledSelect disableUnderline value={value} onChange={handleChange}>
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
