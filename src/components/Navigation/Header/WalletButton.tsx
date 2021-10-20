import React from "react";
import styled from "styled-components";
import CustomButton from "components/CustomButton";

const Button = styled.a`
  background: transparent;
  border: 2px solid white;
  border-radius: 3px;
  color: white;
  /* This renders the buttons above... Edit me! */
  display: inline-block;
  margin: 0.5rem 1rem;
  padding: 0.5rem 0;
  width: 11rem;

  /* The GitHub button is a primary button
   * edit this to target it specifically! */
  /* ${(props) =>
    props.primary &&
    css`
      background: white;
      color: black;
    `} */
`;

const WalletButton = () => <CustomButton href="#wallet">200000 ZIG</CustomButton>;
export default WalletButton;
