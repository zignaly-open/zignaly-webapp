import React from "react";
import "./AvailableBalance.scss";
import { Typography } from "@mui/material";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import EquityPart from "../../TotalEquityBar/EquityPart";
import TotalEquityBar from "../../TotalEquityBar";

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

const SpotAvailableBalance = ({ balance, selectedExchange }) => {
  const color = balance && balance.totalPnlBTC >= 0 ? "green" : "red";

  return (
    <div className="availableBalance">
      <TotalEquityBar>
        <>
          <EquityPart
            info={
              <div>
                = USDT{" "}
                {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                  <AllInclusiveIcon className="infinity" />
                ) : (
                  formatFloat(balance.totalFreeUSDT)
                )}
              </div>
            }
            name="balance.available"
            value={
              <>
                BTC{" "}
                {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                  <AllInclusiveIcon className="infinity" />
                ) : (
                  formatFloat(balance.totalFreeBTC)
                )}
              </>
            }
          />
          <span className="operator">+</span>
          <EquityPart
            info={<>= USDT {formatFloat(balance.totalLockedUSDT)}</>}
            name="balance.invested"
            value={
              <>
                BTC {formatFloat(balance.totalLockedBTC)}
                {/* <Typography className="number1 pnlPercent">
                {balance.totalLockedBTC && balance.totalBTC
                    ? formatFloat2Dec((balance.totalLockedBTC / balance.totalBTC) * 100)
                  : 0}
                %
            </Typography> */}
              </>
            }
          />
          <span className="operator">+</span>
          <EquityPart
            info={<>= USDT {formatFloat(balance.totalPnlUSDT)}</>}
            name="balance.profit"
            value={
              <>
                <Typography className={`number1 ${color}`}>
                  BTC {formatFloat(balance.totalPnlBTC)}
                </Typography>
                <Typography className={`number1 pnlPercent ${color}`}>
                  {balance.totalPnlBTC && balance.totalLockedBTC
                    ? formatFloat2Dec((balance.totalPnlBTC * 100) / balance.totalLockedBTC)
                    : 0}
                  %
                </Typography>
              </>
            }
          />
          <span className="operator">=</span>
          <EquityPart
            info={
              <>
                = USDT{" "}
                {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                  <AllInclusiveIcon className="infinity" />
                ) : (
                  formatFloat(balance.totalUSDT)
                )}
              </>
            }
            name="balance.total"
            value={
              <>
                BTC{" "}
                {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                  <AllInclusiveIcon className="infinity" />
                ) : (
                  formatFloat(balance.totalBTC)
                )}
              </>
            }
          />
        </>
      </TotalEquityBar>
    </div>
  );
};

export default SpotAvailableBalance;
