import React, { useState, useEffect } from "react";
import { size } from "lodash";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import tradeApi from "../../../services/tradeApiClient";
import CustomSelect from "../../CustomSelect/CustomSelect";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import("../../../services/tradeApiClient.types").MarketSymbolsCollection} MarketSymbolsCollection
 */
/**
 * @typedef {Object} TradingViewHeaderProps
 * @property {MarketSymbolsCollection} symbolsList
 * @property {function} handleSymbolChange
 * @property {string} selectedSymbol
 */

/**
 * Trading view header component.
 *
 * @param {TradingViewHeaderProps} props Component props.
 * @returns {JSX.Element} Trading view header element.
 */
const TradingViewHeader = (props) => {
  const { symbolsList, handleSymbolChange, selectedSymbol } = props;
  const { control } = useFormContext();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  // @ts-ignore
  const symbolsOptions = symbolsList.map((symbolItem) => symbolItem.symbol);
  const [ownCopyTradersProviders, setOwnCopyTradersProviders] = useState([]);
  const loadOwnCopyTradersProviders = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    tradeApi.userOwnCopyTradersProvidersOptions(payload).then((copyTradersProvidersOptions) => {
      const digestedOptions = copyTradersProvidersOptions.map((copyTradersProvidersOption) => {
        return {
          label: copyTradersProvidersOption.providerName,
          val: copyTradersProvidersOption.providerId,
        };
      });

      setOwnCopyTradersProviders(digestedOptions);
    });
  };

  useEffect(loadOwnCopyTradersProviders, [storeSettings.selectedExchange.internalId]);

  const selectedProviderValue = ownCopyTradersProviders[0] ? ownCopyTradersProviders[0].val : "";

  return (
    <Box bgcolor="grid.content" className="controlsBar" display="flex" flexDirection="row">
      <Box alignContent="left" className="symbolsSelector" display="flex" flexDirection="column">
        <FormattedMessage id="terminal.browsecoins" />
        <CustomSelect
          label=""
          onChange={handleSymbolChange}
          options={symbolsOptions}
          search={true}
          value={selectedSymbol}
        />
      </Box>
      {size(ownCopyTradersProviders) > 1 && (
        <Box
          alignContent="left"
          className="providersSelector"
          display="flex"
          flexDirection="column"
        >
          <FormattedMessage id="terminal.providers" />
          <Controller
            as={<CustomSelect label="" onChange={() => {}} options={ownCopyTradersProviders} />}
            control={control}
            defaultValue={selectedProviderValue}
            name="providerService"
          />
        </Box>
      )}
    </Box>
  );
};

export default TradingViewHeader;
