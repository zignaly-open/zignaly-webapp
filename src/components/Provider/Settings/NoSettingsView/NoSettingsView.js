import React, { useEffect, useState } from "react";
import "./NoSettingsView.scss";
import { Box, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import useStoreViewsSelector from "../../../../hooks/useStoreViewsSelector";
import ExchangeIcon from "../../../ExchangeIcon";
import { createExchangeConnectionEmptyEntity } from "../../../../services/tradeApiClient.types";
import CloneProviderButton from "../../ProviderHeader/CloneProviderButton";

const NoSettingsView = () => {
  const exchangeConnections = useStoreUserExchangeConnections();
  const storeViews = useStoreViewsSelector();
  const [exchange, setExchange] = useState(createExchangeConnectionEmptyEntity());

  const filterExchange = () => {
    let found = exchangeConnections.find(
      (item) => item.internalId === storeViews.provider.exchangeInternalId,
    );
    if (found) {
      setExchange(found);
    }
  };

  useEffect(filterExchange, []);

  return (
    <Box
      alignItems="center"
      className="noSettingsView"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box
        alignItems="center"
        className="exchangeBox"
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.settings.empty.1" />
        </Typography>
        <Typography className="exchangeName" variant="h3">
          <ExchangeIcon exchange={exchange.name} size="medium" />
          <span>{exchange.internalName}</span>
        </Typography>
      </Box>

      <Box
        alignItems="center"
        className="cloneBox"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Typography variant="h3">
          <FormattedMessage id="srv.settings.empty.2" />
        </Typography>
        <CloneProviderButton provider={storeViews.provider} />
      </Box>
    </Box>
  );
};

export default NoSettingsView;
