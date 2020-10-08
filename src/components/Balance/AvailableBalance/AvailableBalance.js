import React from "react";
import "./AvailableBalance.scss";
import { Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { formatFloat2Dec, formatFloat } from "../../../utils/format";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import EquityPart from "../../TotalEquityBar/EquityPart";
import TotalEquityBar from "../../TotalEquityBar";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserBalanceEntity} UserBalanceEntity
 * @typedef {Object} DefaultProps
 * @property {UserBalanceEntity} balance
 */

/**
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */

const AvailableBalance = ({ balance }) => {
  const { selectedExchange } = useStoreSettingsSelector();
  const color = balance && balance.pnlBTC >= 0 ? "green" : "red";

  return (
    <div className="availableBalance">
      <TotalEquityBar>
        {balance && (
          <>
            <EquityPart
              name="balance.available"
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
              name="balance.invested"
              info={<>= USDT {formatFloat(balance.totalLockedUSDT)}</>}
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
              name="balance.profit"
              info={<>= USDT {formatFloat(balance.pnlUSDT)}</>}
              value={
                <>
                  <Typography className={`number1 ${color}`}>
                    BTC {formatFloat(balance.pnlBTC)}
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
              name="balance.available"
              info={
                <>
                  <Typography variant="h4">
                    <FormattedMessage id="balance.total" />
                  </Typography>
                  <Typography className="smallText number3">
                    = USDT{" "}
                    {selectedExchange.paperTrading && !selectedExchange.isTestnet ? (
                      <AllInclusiveIcon className="infinity" />
                    ) : (
                      formatFloat(balance.totalUSDT)
                    )}
                  </Typography>
                </>
              }
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
        )}
      </TotalEquityBar>
    </div>
  );
};

export default AvailableBalance;
