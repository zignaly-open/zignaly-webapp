import { Box, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useCallback } from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import { formatDateUTC } from "utils/format";
import { ArrowForward } from "@material-ui/icons";

const ListItem = styled.li`
  color: ${(props) => props.theme.newTheme.secondaryText};
  margin-bottom: 16px;
`;

const ItemLabel = styled.span`
  font-weight: 600;
  font-size: 16px;
  margin-right: 8px;
`;

const ItemValue = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.palette.text.primary};
`;

const TitleDesc = styled(Typography)`
  font-weight: 500;
  font-size: 32px;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const PenaltyRow = ({ penalty }: { penalty: Penalty }) => {
  return (
    <Row>
      <FormattedMessage id="wallet.staking.offer.unstakingDays" values={{ days: penalty.days }} />
      &nbsp; <ArrowForward /> &nbsp;
      <FormattedMessage
        id="wallet.staking.offer.unstakingPenalty"
        values={{ percentage: penalty.percentage }}
      />
    </Row>
  );
};

interface VaultOfferModalProps {
  onClose: () => void;
  open: boolean;
  vault: VaultOffer;
}

const formatDay = (date: string) => dayjs(date, "YYYY-MM-DD").format("MMM D, YYYY");

const VaultOfferModal = ({ onClose, open, vault }: VaultOfferModalProps) => {
  const intl = useIntl();
  const {
    coin,
    coinReward,
    startDate,
    minBalance,
    maxBalance,
    rewardsTotal,
    distributionPeriod,
    distributionDate,
    endDate,
    stakingDays,
    type,
    asideMinimum,
    asideCoin,
    boostable,
    returnCoinsDate,
    finishStakingDate,
    boosts,
    unstakeEnabled,
    penalties,
  } = vault;

  const BoostRow = useCallback(
    ({ boost }: { boost: Boost }) => (
      <Row>
        <NumberFormat
          value={boost.minimum}
          displayType="text"
          thousandSeparator={true}
          decimalScale={2}
          suffix={` ${asideCoin}`}
        />
        &nbsp;
        <ArrowForward />
        &nbsp;
        {boost.percentage}x
      </Row>
    ),
    [asideCoin],
  );

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="wallet.staking.offer.title" />
        </Title>
        <TitleDesc>
          <FormattedMessage
            id={`wallet.staking.offer.desc${type === "stake" ? "Stake" : ""}`}
            values={{ coin, reward: coinReward }}
          />
        </TitleDesc>
        <ul>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.minDeposit" />
            </ItemLabel>
            <ItemValue>
              <NumberFormat
                displayType="text"
                value={minBalance}
                suffix={` ${coin}`}
                thousandSeparator={true}
              />
            </ItemValue>
          </ListItem>
          {asideMinimum && (
            <ListItem>
              <ItemLabel>
                <FormattedMessage id="wallet.staking.offer.minCoin" values={{ coin: asideCoin }} />
              </ItemLabel>
              <ItemValue>
                <NumberFormat
                  displayType="text"
                  value={asideMinimum}
                  suffix={` ${asideCoin}`}
                  thousandSeparator={true}
                />
              </ItemValue>
            </ListItem>
          )}
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.maxDeposit" />
            </ItemLabel>
            <ItemValue>
              {maxBalance ? (
                <NumberFormat
                  displayType="text"
                  value={maxBalance}
                  suffix={` ${coinReward}`}
                  thousandSeparator={true}
                />
              ) : (
                <FormattedMessage id="wallet.staking.offer.noLimit" />
              )}
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.stakingBegins" />
            </ItemLabel>
            {/* <ItemValue>{dayjs(vault.startDate).format("L LT")}</ItemValue> */}
            <ItemValue>{formatDateUTC(startDate)}</ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.stakingEnds" />
            </ItemLabel>
            <ItemValue>{formatDateUTC(finishStakingDate)}</ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.totalRewards" />
            </ItemLabel>
            <ItemValue>
              <NumberFormat
                displayType="text"
                value={rewardsTotal}
                suffix={` ${coinReward}`}
                thousandSeparator={true}
              />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.rewardBegins" />
            </ItemLabel>
            {/* <ItemValue>{dayjs(vault.startDate).format("L LT")}</ItemValue> */}
            <ItemValue>{formatDay(distributionDate)}</ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.rewardEnds" />
            </ItemLabel>
            <ItemValue>{formatDay(endDate)}</ItemValue>
          </ListItem>
          {type === "stake" && (
            <ListItem>
              <ItemLabel>
                <FormattedMessage id="wallet.staking.offer.returnFunds" />
              </ItemLabel>
              <ItemValue>{formatDay(returnCoinsDate)}</ItemValue>
            </ListItem>
          )}
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.awarded" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage id={`wallet.staking.offer.awarded.${distributionPeriod}`} />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.calculation" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage
                id={`wallet.staking.offer.calculation${boostable ? "Boost" : ""}.val`}
                values={{ days: stakingDays }}
              />
            </ItemValue>
          </ListItem>
          {boostable && (
            <ListItem>
              <ItemLabel>
                <FormattedMessage id="wallet.staking.offer.boostOptions" />
              </ItemLabel>
              <ItemValue>
                {boosts.map((boost, i) => (
                  <BoostRow boost={boost} key={i} />
                ))}
              </ItemValue>
            </ListItem>
          )}
          {type === "stake" && (
            <ListItem>
              <ItemLabel>
                <FormattedMessage id="wallet.staking.offer.unstakingConditions" />
              </ItemLabel>
              <ItemValue>
                {!unstakeEnabled ? (
                  <FormattedMessage id="vault.unstake.notPossible" />
                ) : unstakeEnabled && !penalties?.length ? (
                  <FormattedMessage id="wallet.staking.offer.unstakingAllowed" />
                ) : (
                  <>
                    <FormattedMessage id="wallet.staking.offer.unstakingAllowedFees" />
                    {penalties.map((penalty, i) => (
                      <PenaltyRow penalty={penalty} key={i} />
                    ))}
                  </>
                )}
              </ItemValue>
            </ListItem>
          )}
        </ul>
      </Modal>
    </CustomModal>
  );
};

export default VaultOfferModal;
