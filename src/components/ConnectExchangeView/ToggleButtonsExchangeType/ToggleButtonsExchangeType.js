import React, { useEffect } from "react";
import { Typography } from "@material-ui/core";
import { ToggleButtonGroup, ToggleButton } from "@material-ui/lab";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {ExchangeListEntity} exchange
 */

/**
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ToggleButtonsExchangeType = ({ exchange, exchangeType, setExchangeType }) => {
  // Account types options
  const typeOptions =
    exchange &&
    exchange.type.map((t) => ({
      val: t,
      label: t.charAt(0).toUpperCase() + t.slice(1),
    }));

  useEffect(() => {
    // Set default exchange type on exchange change.
    if (exchange) {
      setExchangeType(typeOptions[0].val);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchange]);

  return (
    <>
      {typeOptions && typeOptions.length && (
        <>
          <Typography className="bold title">
            <FormattedMessage id="accounts.exchange.type" />
          </Typography>
          <ToggleButtonGroup
            className="typeButtons"
            exclusive
            onChange={(e, val) => setExchangeType(val)}
            value={exchangeType}
          >
            {typeOptions.map((t) => (
              <ToggleButton key={t.val} value={t.val}>
                {t.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </>
      )}
    </>
  );
};

export default ToggleButtonsExchangeType;
