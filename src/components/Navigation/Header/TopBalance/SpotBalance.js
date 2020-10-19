import React from "react";
import { Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat } from "../../../../utils/format";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import BalanceBox from "./BalanceBox";
import BalaneBox from "./BalanceBox";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {UserBalanceEntity} balance
 * @property {ExchangeConnectionEntity} selectedExchange
 */

/**
 * Render a part of the equity bar
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} JSX
 */
const SpotBalance = ({ balance, selectedExchange }) => {
  return (
    <>
      <BalanceBox
        name={<FormattedMessage id="balance.available" />}
        value1={
          <>
            BTC{" "}
            {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
              <AllInclusiveIcon className="infinity" />
            ) : (
              formatFloat(balance.totalFreeBTC)
            )}
          </>
        }
        value2={
          <>
            USDT{" "}
            {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
              <AllInclusiveIcon className="infinity" />
            ) : (
              formatFloat(balance.totalFreeUSDT)
            )}
          </>
        }
      />

      <BalaneBox
        name={<FormattedMessage id="balance.invested" />}
        value1={<> BTC {formatFloat(balance.totalLockedBTC)}</>}
        value2={<>USDT {formatFloat(balance.totalLockedUSDT)}</>}
      />

      <BalaneBox
        name={<FormattedMessage id="balance.profitlosses" />}
        value1={
          <Typography
            className={`${balance.pnlBTC > 0 ? "green" : balance.pnlBTC < 0 ? "red" : ""} number1`}
          >
            BTC {formatFloat(balance.pnlBTC)}
          </Typography>
        }
        value2={
          <Typography
            className={`${balance.pnlBTC > 0 ? "green" : balance.pnlBTC < 0 ? "red" : ""} number3`}
            variant="subtitle2"
          >
            USDT {formatFloat(balance.pnlUSDT)}
          </Typography>
        }
      />
    </>
  );
};

export default SpotBalance;
