import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeListEntity} ExchangeListEntity
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Array<string>} exchangeTypes
 * @property {string} exchangeType
 * @property {function} setExchangeType
 */

/**
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */
const ToggleButtonsExchangeType = ({ exchangeTypes, exchangeType, setExchangeType }) => {
  // Account types options
  const typeOptions = exchangeTypes.map((t) => ({
    val: t,
    label: t.charAt(0).toUpperCase() + t.slice(1),
  }));

  useEffect(() => {
    // Set default exchange type on exchange change.
    setExchangeType(typeOptions[0].val);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exchangeTypes.length]);

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
            onChange={(e, val) => {
              if (val) setExchangeType(val);
            }}
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
