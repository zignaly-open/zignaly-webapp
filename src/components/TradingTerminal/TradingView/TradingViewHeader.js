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
  const { control, register, watch } = useFormContext();
  const storeSession = useStoreSessionSelector();
  const storeSettings = useStoreSettingsSelector();
  // @ts-ignore
  const symbolsOptionsAll = symbolsList.map((symbolItem) => {
    return symbolItem.symbol;
  });
  const [ownCopyTradersProviders, setOwnCopyTradersProviders] = useState([]);
  const loadOwnCopyTradersProviders = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      internalExchangeId: storeSettings.selectedExchange.internalId,
    };

    tradeApi.userOwnCopyTradersProvidersOptions(payload).then((data) => {
      setOwnCopyTradersProviders(data);
    });
  };

  useEffect(loadOwnCopyTradersProviders, [storeSettings.selectedExchange.internalId]);

  const providerOptions = ownCopyTradersProviders.map((provider) => {
    return {
      label: provider.providerName,
      val: String(provider.providerId),
    };
  });

  const selectedProviderValue = providerOptions[0] ? providerOptions[0].val : "";
  const providerId = watch("providerService");
  const providerService = ownCopyTradersProviders.find(
    (provider) => provider.providerId === providerId,
  ) || {
    providerPayableBalance: 0,
    providerConsumedBalance: 0,
    providerName: "Manual Trading",
    providerId: "1",
  };

  // Filter signal provider symbols options when is selected.
  const symbolsOptions = symbolsOptionsAll.filter((symbol) => {
    if (providerId && providerId !== "1" && providerService) {
      return symbol.includes("/" + providerService.providerQuote);
    }

    return true;
  });

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
            as={<CustomSelect label="" onChange={() => {}} options={providerOptions} />}
            control={control}
            defaultValue={selectedProviderValue}
            name="providerService"
          />
          <input
            name="providerPayableBalance"
            ref={register}
            type="hidden"
            value={providerService.providerPayableBalance}
          />
          <input
            name="providerConsumedBalance"
            ref={register}
            type="hidden"
            value={providerService.providerConsumedBalance || 0}
          />
          <input
            name="providerName"
            ref={register}
            type="hidden"
            value={providerService.providerName}
          />
        </Box>
      )}
    </Box>
  );
};

export default TradingViewHeader;
