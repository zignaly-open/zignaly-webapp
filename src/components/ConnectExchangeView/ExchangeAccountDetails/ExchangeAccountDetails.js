import React from "react";
import { Box, Typography, useMediaQuery } from "@material-ui/core";
import ExchangeIcon from "../../ExchangeIcon";
import "./ExchangeAccountDetails.scss";
import useStoreUserSelector from "../../../hooks/useStoreUserSelector";
import ExchangeAccountData from "./ExchangeAccountData";
import CustomButton from "../../CustomButton";
import { FormattedMessage } from "react-intl";

const ExchangeAccountDetails = ({ type, openExchangeAction }) => {
  const storeUser = useStoreUserSelector();
  const exchanges = storeUser.exchangeConnections.filter((e) =>
    e.paperTrading || e.isTestnet ? type === "demoAccount" : type === "realAccount",
  );

  return (
    <Box className="exchangeAccountDetails">
      {exchanges.map((item, index) => (
        <Box className="exchangeAccountInfo" key={item.internalId}>
          <Box
            className="accountInfoHeader"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="row" alignItems="center">
              <ExchangeIcon exchange={item.name.toLowerCase()} size="xlarge" />
              <Typography variant="h3">{item.internalName}</Typography>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <CustomButton
                onClick={() => openExchangeAction(item.internalId, "settings")}
                className="textDefault"
              >
                <FormattedMessage id="accounts.settings" />
              </CustomButton>
              <CustomButton className="textPurple">
                <FormattedMessage id="accounts.deposit" />
              </CustomButton>
              <CustomButton className="textPurple">
                <FormattedMessage id="accounts.withdraw" />
              </CustomButton>
            </Box>
          </Box>
          <ExchangeAccountData internalId={item.internalId} />
        </Box>
      ))}
    </Box>
  );
};

export default ExchangeAccountDetails;
