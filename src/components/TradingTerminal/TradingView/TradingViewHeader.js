import React from "react";
import { size, isBoolean } from "lodash";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage, useIntl } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import CustomSelect from "../../CustomSelect/CustomSelect";
import useOwnCopyTraderProviders from "../../../hooks/useOwnCopyTraderProviders";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import { setTerminalProvider, setTerminalPair } from "../../../store/actions/settings";
import { useDispatch } from "react-redux";
import useEffectSkipFirst from "../../../hooks/useEffectSkipFirst";

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
  const symbolsOptionsAll = symbolsList.map((symbolItem) => {
    return symbolItem.short;
  });
  const { ownCopyTraderProviders } = useOwnCopyTraderProviders();
  const { formatMessage } = useIntl();
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  const providerOptions = ownCopyTraderProviders.map((provider) => {
    return {
      label: provider.providerName,
      val: String(provider.providerId),
    };
  });

  // Select saved provider or default to first option
  const selectedProviderValue = providerOptions.find(
    (o) => o.val === storeSettings.tradingTerminal.provider,
  )
    ? storeSettings.tradingTerminal.provider
    : providerOptions[0]
    ? providerOptions[0].val
    : "";
  const providerId = watch("providerService");
  const providerService = ownCopyTraderProviders.find(
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

  const saveSelectedProvider = (/** @type {string} **/ value) => {
    dispatch(setTerminalProvider(value));
  };

  // Filter signal provider symbols options when is selected.
  const symbolsOptions = symbolsOptionsAll.filter((symbol) => {
    if (providerService && providerId && providerId !== "1") {
      const { providerQuote } = providerService;
      if (isBoolean(providerQuote)) {
        return providerQuote === true;
      }

      return symbol.includes("/" + providerQuote);
    }

    return true;
  });

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
            defaultValue={selectedProviderValue}
            name="providerService"
            render={({ onChange, value }) => (
              <CustomSelect
                label=""
                onChange={(/** @type {string} **/ v) => {
                  saveSelectedProvider(v);
                  onChange(v);
                }}
                options={providerOptions}
                value={value}
              />
            )}
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
            name="providerConsumedBalancePercentage"
            ref={register}
            type="hidden"
            value={providerService.providerConsumedBalancePercentage || 0}
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
