import { Box } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import { formatPrice } from "utils/formatters";
import CoinIcon from "../CoinIcon";
import VaultDepositButton from "./VaultDepositButton";
import styled from "styled-components";
import { SecondaryText } from "styles/styles";
import RewardsProgressCircle from "./RewardsProgressCircle";

const EarnText = styled.div`
  font-weight: 600;
  margin: 0 16px;
  line-height: 20px;
`;

const Coin = styled.span`
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  margin: 0 7px 0 4px;
  color: ${(props) => props.theme.newTheme.purple};
`;

const Label = styled(SecondaryText)`
  font-weight: 600;
  font-size: 12px;
`;

const StartDate = styled(SecondaryText)`
  margin-right: 12px;
`;

const Amount = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const Panel = styled.div`
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
`;

interface VaultMobileProps {
  vaults: VaultOffer[];
  balance: WalletBalance;
  onOfferClick: (coin: string) => void;
}

const VaultMobile = ({ vaults, balance, onOfferClick }: VaultMobileProps) => {
  return (
    <Box>
      {vaults.map((v) => (
        <Panel key={v.id}>
          <Box display="flex" alignItems="center">
            <RewardsProgressCircle vault={v} />
            <EarnText>
              <FormattedMessage
                id="wallet.staking.earn"
                values={{ coin: v.coin, reward: v.coinReward, amount: v.minBalance }}
              />
            </EarnText>
            <VaultDepositButton
              vault={v}
              balance={balance && balance[v.coin].total.availableBalance}
              onClick={() => onOfferClick(v.coin)}
            />
          </Box>
          <Box display="flex" justifyContent="space-between" mt="8px">
            <div>
              <Label>
                <FormattedMessage id="vault.startsEnds" />
              </Label>
              <Box display="flex">
                <StartDate>{dayjs(v.startDate).format("MMM D")}</StartDate>
                {dayjs(v.endDate).format("MMM D, YYYY")}
              </Box>
            </div>
            <div>
              <Label>
                <FormattedMessage id="vault.minBalance" />
              </Label>
              <Amount>
                {formatPrice(v.minBalance, "", " ", true)}
                <Coin>{v.coinReward}</Coin>
                <CoinIcon width={16} height={16} coin={v.coinReward} />
              </Amount>
            </div>
            <div>
              <Label>
                <FormattedMessage id="vault.apr" />
              </Label>
              <Amount>{v.apr}%</Amount>
            </div>
          </Box>
        </Panel>
      ))}
    </Box>
  );
};

export default VaultMobile;
