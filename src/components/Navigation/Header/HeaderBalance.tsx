import React, { useContext } from "react";
import CustomButton from "components/CustomButton";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { useStoreUserExchangeConnections } from "hooks/useStoreUserSelector";
import PrivateAreaContext from "context/PrivateAreaContext";
import { Link } from "gatsby";

const BalanceMiniChart = () => {
  return <></>;
};

const HeaderBalance = () => {
  const exchangeConnections = useStoreUserExchangeConnections();
  const { connectedProviders, balance } = useContext(PrivateAreaContext);
  const hasFunds = !balance || balance.totalUSDT + balance.totalLockedUSDT > 0;
  const hasConnectedProfitSharing =
    connectedProviders.filter((p) => p.type === "profitSharing").length > 0;
  let showAddFunds = false;
  let showFindTraders = false;
  const hasOnlyDefaultExchangeAccount =
    exchangeConnections.length === 1 &&
    exchangeConnections[0].exchangeName.toLowerCase() === "zignaly";
  if (hasOnlyDefaultExchangeAccount && !hasConnectedProfitSharing) {
    if (!hasFunds) {
      showAddFunds = true;
    } else {
      showFindTraders = true;
    }
  }
  const hasOnlyNonBrokerAccount =
    exchangeConnections.length === 1 &&
    exchangeConnections[0].exchangeName.toLowerCase() !== "zignaly";

  return (
    <div>
      <div>
        <FormattedMessage id="balance.value" />
        &nbsp;$19,250
      </div>
      <div>
        <FormattedMessage id="balance.avail" />
        &nbsp;$1120
      </div>
      {exchangeConnections.length > 0 &&
        (!showAddFunds && !showFindTraders ? (
          <BalanceMiniChart />
        ) : showAddFunds ? (
          <CustomButton className="customButton textPurple" href="#exchangeAccounts">
            <FormattedMessage id="accounts.addfunds" />
          </CustomButton>
        ) : (
          <CustomButton className="customButton textPurple" component={Link} to="/profitSharing">
            <FormattedMessage id="accounts.findtraders" />
          </CustomButton>
        ))}
      {hasOnlyNonBrokerAccount && (
        <CustomButton className="customButton textPurple" component={Link} to="/profitSharing">
          <FormattedMessage id="accounts.startps" />
        </CustomButton>
      )}
    </div>
  );
};
export default HeaderBalance;
