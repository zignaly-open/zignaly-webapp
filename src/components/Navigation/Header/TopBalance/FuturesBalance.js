import React from "react";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { formatFloat } from "../../../../utils/format";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
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
const FuturesBalance = ({ balance, selectedExchange }) => {
  return (
    <>
      <BalaneBox
        name={<FormattedMessage id="balance.wallet" />}
        value1={<> BTC {formatFloat(balance.totalWalletBTC)}</>}
        value2={<>USDT {formatFloat(balance.totalWalletUSDT)}</>}
      />

      <BalaneBox
        name={<FormattedMessage id="balance.profitlosses" />}
        value1={
          <Typography
            className={`${
              balance.totalUnrealizedProfitBTC > 0
                ? "green"
                : balance.totalUnrealizedProfitBTC < 0
                ? "red"
                : ""
            } number1`}
          >
            BTC {formatFloat(balance.totalUnrealizedProfitBTC)}
          </Typography>
        }
        value2={
          <Typography
            className={`${
              balance.totalUnrealizedProfitUSDT > 0
                ? "green"
                : balance.totalUnrealizedProfitUSDT < 0
                ? "red"
                : ""
            } number3`}
            variant="subtitle2"
          >
            USDT {formatFloat(balance.totalUnrealizedProfitUSDT)}
          </Typography>
        }
      />

      <BalaneBox
        name={<FormattedMessage id="balance.margin" />}
        value1={<> BTC {formatFloat(balance.totalMarginBTC)}</>}
        value2={<>USDT {formatFloat(balance.totalMarginUSDT)}</>}
      />

      <BalanceBox
        name={<FormattedMessage id="balance.available" />}
        value1={
          <>
            BTC{" "}
            {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
              <AllInclusiveIcon className="infinity" />
            ) : (
              formatFloat(balance.totalAvailableBTC)
            )}
          </>
        }
        value2={
          <>
            USDT{" "}
            {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
              <AllInclusiveIcon className="infinity" />
            ) : (
              formatFloat(balance.totalAvailableUSDT)
            )}
          </>
        }
      />
    </>
  );
};

export default FuturesBalance;
