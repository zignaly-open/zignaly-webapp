import React from "react";
import { Box } from "@material-ui/core";
import "./login.scss";
import TwoFAForm from "../../components/Forms/TwoFAForm";
import Modal from "../../components/Modal";
import Logo from "../../images/logo/logoWhite.svg";
import Testimonials from "../../components/Testimonials";
import LoginTabs from "../../components/LoginTabs";
import { Helmet } from "react-helmet";
import ConnectExchangeView from "../../components/ConnectExchangeView";
import { ModalRoutingContext } from "gatsby-plugin-modal-routing";

const ExchangeAccountsPage = () => {
  const show2FA = false;

  return (
    <ModalRoutingContext.Consumer>
      {({ modal, closeTo }) => {
        console.log(modal);
        return <ConnectExchangeView />;
      }}
    </ModalRoutingContext.Consumer>
  );
};

export default ExchangeAccountsPage;
