import React, { useEffect, useContext } from "react";
import { FormattedMessage } from "react-intl";
import ModalPathContext from "../ModalPathContext";
import { Box, Typography } from "@material-ui/core";
import { SubNavModalHeader } from "../../SubNavHeader";
import "./ExchangeAccountDeposit.scss";
import CustomButton from "../../CustomButton";
import MastercardIcon from "../../../images/exchangeAccount/mastercard.svg";
import VisaIcon from "../../../images/exchangeAccount/visa.svg";

const ExchangeAccountDeposit = () => {
  const {
    pathParams: { selectedAccount, previousPath },
    setTitle,
    formRef,
    setTempMessage,
    setPathParams,
  } = useContext(ModalPathContext);

  useEffect(() => {
    setTitle(selectedAccount.internalName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    {
      id: "deposit",
      title: "accounts.deposit",
    },
    {
      id: "withdraw",
      title: "accounts.withdraw",
    },
  ];

  return (
    <Box className="exchangeAccountDeposit">
      <SubNavModalHeader links={tabs} />
      <Box className="buyCryptoBox">
        <Typography variant="h3">
          <FormattedMessage id="deposit.buy" />
        </Typography>
        <Typography variant="body1">
          <FormattedMessage id="deposit.buy.how" />
        </Typography>
        <CustomButton
          className="bgPurple"
          href="https://changelly.com/?ref_id=q0s68wsie1uf9wza"
          target="_blank"
        >
          <Typography variant="body2">
            <FormattedMessage id="deposit.buy.creditcard" />
          </Typography>
        </CustomButton>
        <Box className="creditCard" flexDirection="row">
          <img alt="Visa" src={VisaIcon} />
          <img alt="MasterCard" src={MastercardIcon} />
        </Box>
      </Box>
    </Box>
  );
};

export default ExchangeAccountDeposit;
