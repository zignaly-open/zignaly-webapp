import React from "react";
import { Tooltip } from "@material-ui/core";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * Provides the navigation bar for the dashboard.
 *
 * @param {DefaultProps} props Default props
 * @returns {JSX.Element} Component JSX.
 */
const BaseCurrency = ({ provider }) => {
  const getProvideQuotes = () => {
    let quotes = "";
    if (provider.signalProviderQuotes) {
      if (provider.signalProviderQuotes.length <= 2) {
        for (let a = 0; a < provider.signalProviderQuotes.length; a++) {
          quotes += provider.signalProviderQuotes[a];
          if (a !== provider.signalProviderQuotes.length - 1) {
            quotes += ", ";
          }
        }
      } else {
        for (let a = 0; a < 2; a++) {
          quotes += provider.signalProviderQuotes[a];
          if (a !== 1) {
            quotes += ", ";
          } else {
            quotes += "...";
          }
        }
      }
    }
    return quotes;
  };

  const getProviderQuotesTooltip = () => {
    let quotes = "";
    if (provider.signalProviderQuotes) {
      for (let a = 0; a < provider.signalProviderQuotes.length; a++) {
        quotes += provider.signalProviderQuotes[a];
        if (a !== provider.signalProviderQuotes.length - 1) {
          quotes += ", ";
        }
      }
    }
    return quotes;
  };

  return (
    <>
      {provider.isCopyTrading ? (
        <b>{provider.copyTradingQuote ? provider.copyTradingQuote.toUpperCase() : ""}</b>
      ) : (
        <Tooltip placement="top" title={getProviderQuotesTooltip()}>
          <b>{getProvideQuotes()}</b>
        </Tooltip>
      )}
    </>
  );
};

export default BaseCurrency;
