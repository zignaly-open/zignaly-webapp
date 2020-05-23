import React, { useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import tradeApi from "../../../services/tradeApiClient";

const BalanceBox = () => {
  const authenticateUser = async () => {
    const loginPayload = {
      email: "mailxuftg1pxzk@example.test",
      password: "abracadabra",
    };

    return await tradeApi.userLogin(loginPayload);
  };

  useEffect(() => {
    const loadUserBalance = async () => {
      try {
        const userEntity = await authenticateUser();
        const sessionPayload = {
          token: userEntity.token,
        };
        const responseData = await tradeApi.userBalanceGet(sessionPayload);
        console.log(responseData);
      } catch (error) {
        console.log(error);
      }
    };

    loadUserBalance();
  }, []);

  return (
    <Box
      alignItems="center"
      className="balanceContainer"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box
        alignItems="flex-start"
        className="balanceBox"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography className="title" variant="subtitle1">
          <FormattedMessage id="balance.available" />
        </Typography>
        <Typography className="balance" variant="h5">
          btc 0.256
        </Typography>
      </Box>
      <Box
        alignItems="flex-start"
        className="balanceBox"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography className="title" variant="subtitle1">
          <FormattedMessage id="balance.invested" />
        </Typography>
        <Typography className="balance" variant="h5">
          btc 0.452
        </Typography>
      </Box>
      <Box
        alignItems="flex-start"
        className="balanceBox"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography className="title" variant="subtitle1">
          <FormattedMessage id="col.plnumber" />
        </Typography>
        <Typography className="balance green" variant="h5">
          btc +0.47
        </Typography>
      </Box>
    </Box>
  );
};

export default BalanceBox;
