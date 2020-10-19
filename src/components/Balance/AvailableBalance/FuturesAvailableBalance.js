import React from "react";
import "./AvailableBalance.scss";
import { Typography } from "@material-ui/core";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import EquityPart from "../../TotalEquityBar/EquityPart";
import TotalEquityBar from "../../TotalEquityBar";
import { formatNumber } from "../../../utils/formatters";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {import("../../../services/tradeApiClient.types").ExchangeConnectionEntity} ExchangeConnectionEntity
 * @typedef {Object} DefaultProps
 * @property {UserBalanceEntity} balance
 * @property {ExchangeConnectionEntity} selectedExchange
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const FuturesAvailableBalance = ({ balance, selectedExchange }) => {
  const color = balance && balance.pnlBTC >= 0 ? "green" : "red";

  return (
    <div className="availableBalance">
      <TotalEquityBar>
        {balance && (
          <>
            <EquityPart
              info={
                <div>
                  = USDT{" "}
                  {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                    <AllInclusiveIcon className="infinity" />
                  ) : (
                    formatNumber(balance.totalWalletUSD, 2)
                  )}
                </div>
              }
              name="balance.wallet"
              value={
                <>
                  BTC{" "}
                  {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                    <AllInclusiveIcon className="infinity" />
                  ) : (
                    formatFloat(balance.totalWalletBTC)
                  )}
                </>
              }
            />
            <span className="operator">+</span>
            <EquityPart
              info={<>= USDT {formatNumber(balance.totalUnrealizedProfitUSD, 2)}</>}
              name="balance.profit"
              value={
                <>
                  <Typography className={`number1 ${color}`}>
                    BTC {formatFloat(balance.totalUnrealizedProfitBTC)}
                  </Typography>
                  <Typography className={`number1 pnlPercent ${color}`}>
                    {balance.pnlBTC && balance.totalLockedBTC
                      ? formatFloat2Dec((balance.pnlBTC * 100) / balance.totalLockedBTC)
                      : 0}
                    %
                  </Typography>
                </>
              }
            />
            <span className="operator">=</span>

            <EquityPart
              info={<>= USDT {formatNumber(balance.totalMarginUSD, 2)}</>}
              name="balance.margin"
              value={
                <Typography className={`number1 ${color}`}>
                  BTC {formatFloat(balance.totalMarginBTC)}
                </Typography>
              }
            />

            <span className="operator">+</span>
            <EquityPart
              info={<>= USDT {formatNumber(balance.totalCurrentMarginUSD, 2)}</>}
              name="balance.current"
              value={
                <Typography className={`number1 ${color}`}>
                  BTC {formatFloat(balance.totalCurrentMarginUSD)}
                </Typography>
              }
            />

            <span className="operator">=</span>
            <EquityPart
              info={
                <>
                  <Typography className="smallText number3">
                    = USDT{" "}
                    {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                      <AllInclusiveIcon className="infinity" />
                    ) : (
                      formatNumber(balance.totalAvailableUSD, 2)
                    )}
                  </Typography>
                </>
              }
              name="balance.available"
              value={
                <>
                  BTC{" "}
                  {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                    <AllInclusiveIcon className="infinity" />
                  ) : (
                    formatFloat(balance.totalAvailableBTC)
                  )}
                </>
              }
            />
          </>
        )}
      </TotalEquityBar>
    </div>
  );
};

export default FuturesAvailableBalance;
