import React from "react";
import { Button as ButtonMui, ButtonProps, CircularProgress } from "@material-ui/core";
import styled from "styled-components";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

const StyledButton = styled(ButtonMui)`
  font-weight: 600;
  text-transform: capitalize;
  border-width: 2px !important;
  font-size: 16px;
`;

const Button = (props: CustomButtonProps) => {
  const { loading, disabled, children, color = "primary", variant = "outlined", ...others } = props;
  return (
    <StyledButton disabled={loading || disabled} color={color} variant={variant} {...others}>
      {loading ? <CircularProgress size={35} thickness={5} /> : children}
    </StyledButton>
  );
};

export default Button;
