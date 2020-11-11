import React, { useContext, useEffect, useState } from "react";
import { size } from "lodash";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import CustomSelect from "../../CustomSelect/CustomSelect";
import useOwnCopyTraderProviders from "../../../hooks/useOwnCopyTraderProviders";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { setTerminalProvider, setTerminalPair } from "../../../store/actions/settings";
import { useDispatch } from "react-redux";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";
import TradingViewContext from "./TradingViewContext";

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
  const { control, watch } = useFormContext();
  const { ownCopyTraderProviders } = useOwnCopyTraderProviders();
  const { formatMessage } = useIntl();
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  const { providerService, setProviderService } = useContext(TradingViewContext);
  const providerId = watch("providerService");
  const selectedExchange = storeSettings.selectedExchange;

  // Filter provider symbols options
  const filterSymbols = () => {
    return symbolsList.reduce((result, symbol) => {
      if (
        providerService &&
        providerId &&
        providerId !== "1" &&
        selectedExchange.exchangeName.toLowerCase() !== "bitmex"
      ) {
        const { providerQuote } = providerService;
        if (providerQuote === true || symbol.short.includes("/" + providerQuote)) {
          result.push(symbol.short);
        }
      }
      return result;
    }, []);
  };
  const [symbolsOptions, setSymbolsOptions] = useState(filterSymbols());

  const providerOptions = ownCopyTraderProviders.map((provider) => {
    return {
      label: provider.providerName,
      val: String(provider.providerId),
    };
  });

  // Select saved provider or default to first option
  const initialProviderId = providerOptions.find(
    (o) => o.val === storeSettings.tradingTerminal.provider,
  )
    ? storeSettings.tradingTerminal.provider
    : providerOptions[0]
    ? providerOptions[0].val
    : "";

  useEffect(() => {
    const newProviderService = ownCopyTraderProviders.find(
      (provider) => provider.providerId === providerId,
    ) || {
      providerPayableBalance: 0,
      providerConsumedBalance: 0,
      providerConsumedBalancePercentage: 0,
      providerName: formatMessage({
        id: "terminal.provider.manual",
      }),
      providerQuote: "",
      providerId: "1",
    };
    // Update context
    setProviderService(newProviderService);

    // Save provider settings
    dispatch(setTerminalProvider(providerId));
  }, [providerId]);

  useEffect(() => {
    // Update symbols matching provider
    setSymbolsOptions(filterSymbols());
  }, [providerId, selectedExchange]);

  // Save filters to store when changed
  const saveSelectedSymbol = () => {
    dispatch(
      setTerminalPair({
        exchangeId: storeSettings.selectedExchange.exchangeId,
        pair: selectedSymbol,
      }),
    );
  };
  useEffectSkipFirst(saveSelectedSymbol, [selectedSymbol]);

  return (
    <Box bgcolor="grid.content" className="controlsBar" display="flex" flexDirection="row">
      <Box alignContent="left" className="symbolsSelector" display="flex" flexDirection="column">
        <Typography variant="body1">
          <FormattedMessage id="terminal.browsecoins" />
        </Typography>
        <CustomSelect
          label=""
          onChange={handleSymbolChange}
          options={symbolsOptions}
          search={true}
          value={selectedSymbol}
        />
      </Box>
      {size(ownCopyTraderProviders) > 1 && (
        <Box
          alignContent="left"
          className="providersSelector"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="body1">
            <FormattedMessage id="terminal.providers" />
          </Typography>
          <Controller
            control={control}
            defaultValue={initialProviderId}
            name="providerService"
            render={({ onChange, value }) => (
              <CustomSelect
                label=""
                onChange={(/** @type {string} **/ v) => {
                  onChange(v);
                }}
                options={providerOptions}
                value={value}
              />
            )}
          />
        </Box>
      )}
    </Box>
  );
};

export default TradingViewHeader;
