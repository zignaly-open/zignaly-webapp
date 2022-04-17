import React from "react";
import ImageWithBasePath from "components/ImageWithBasePath";
import useUser from "lib/useUser";
import { Typography } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setSelectedExchange } from "src/store/actions/settings";

import * as styled from "./styles";

const AccountSelector = () => {
  const intl = useIntl();
  const {
    user,
    selectedExchange: { internalName, exchangeType, internalId },
  } = useUser();
  const dispatch = useDispatch();

  const exchangeAccounts = user.exchanges.map((e) => ({
    caption: e.internalName,
    value: e.internalId,
    // leftElement:
  }));

  const handleExchangeAccountChange = (e) => {
    dispatch(setSelectedExchange(e.value));
  };

  return (
    <styled.Layout>
      <ImageWithBasePath src="/images/avatar.svg" width={68} height={68} />
      <styled.InfoBox>
        <Box display="flex">
          <Typography variant="h1">{internalName}</Typography>
          <styled.SelectorContainer>
            <styled.Selector
              // initialSelectedIndex={exchangeAccounts.findIndex((e) => e.value === internalId) + 1}
              options={exchangeAccounts}
              onSelectItem={handleExchangeAccountChange}
              mode="collapsed"
            />
          </styled.SelectorContainer>
        </Box>
        <styled.TypographyType>
          <FormattedMessage id="dashboard.type" />
          &nbsp;
          <FormattedMessage
            id={exchangeType === "futures" ? "exchange.type.futures" : "exchange.type.spot"}
          />
        </styled.TypographyType>
      </styled.InfoBox>
    </styled.Layout>
  );
};

export default AccountSelector;
