import { Box, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
// const localizedFormat = require("dayjs/plugin/localizedFormat");
// dayjs.extend(localizedFormat);

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

const SecondaryText = styled.span`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-size: 14px;
  font-style: italic;
`;

interface CompoundingTextProps {
  compounding: boolean;
}
const CompoundingText = styled.span`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.newTheme.red};

  ${(props: CompoundingTextProps) =>
    props.compounding &&
    css`
      color: ${props.theme.newTheme.green}};
    `}
`;

const TitleDesc = styled(Typography)`
  font-weight: 500;
  font-size: 32px;
  margin-bottom: 16px;
`;

interface VaultOfferModalProps {
  onClose: () => void;
  open: boolean;
  vault: VaultOffer;
}

const formatUTC = (date: string) => dayjs(date, "YYYY-MM-DD").format("MMMM DD, YYYY hh:mm A UTC");
const formatDay = (date: string) => dayjs(date, "YYYY-MM-DD").format("MMM D, YYYY");

const VaultOfferModal = ({ onClose, open, vault }: VaultOfferModalProps) => {
  const intl = useIntl();
  const {
    coin,
    coinReward,
    startDate,
    lockupDate,
    minBalance,
    maxBalance,
    rewardsTotal,
    distributionPeriod,
    distributionDate,
    endDate,
    stakingDays,
  } = vault;

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="wallet.staking.offer.title" />
        </Title>
        <TitleDesc>
          <FormattedMessage id="wallet.staking.offer.desc" values={{ coin, reward: coinReward }} />
        </TitleDesc>
        <ul>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.minDeposit" />
            </ItemLabel>
            <ItemValue>
              <NumberFormat displayType="text" value={minBalance} suffix={` ${coin}`} />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.maxDeposit" />
            </ItemLabel>
            <ItemValue>
              {maxBalance ? (
                <NumberFormat displayType="text" value={maxBalance} suffix={` ${coinReward}`} />
              ) : (
                <FormattedMessage id="wallet.staking.offer.none" />
              )}
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.stakingBegins" />
            </ItemLabel>
            {/* <ItemValue>{dayjs(vault.startDate).format("L LT")}</ItemValue> */}
            <ItemValue>{formatUTC(startDate)}</ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.rewardBegins" />
            </ItemLabel>
            {/* <ItemValue>{dayjs(vault.startDate).format("L LT")}</ItemValue> */}
            <ItemValue>{formatUTC(distributionDate)}</ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.rewardEnds" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage
                id="wallet.staking.offer.rewardEnds.val"
                values={{
                  coin: coinReward,
                  amount: rewardsTotal.toLocaleString("en-US"),
                  date: formatDay(endDate),
                }}
              />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.lockup" />
            </ItemLabel>
            <ItemValue>
              {lockupDate ? (
                formatUTC(lockupDate)
              ) : (
                <FormattedMessage id="wallet.staking.offer.none" />
              )}
            </ItemValue>
          </ListItem>
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
                id="wallet.staking.offer.calculation.val"
                values={{ days: stakingDays }}
              />
            </ItemValue>
          </ListItem>
          {/* <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.firstAwarded" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage id="wallet.staking.offer.firstAwarded.val" />
            </ItemValue>
          </ListItem> */}
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.compounding" />
            </ItemLabel>
            <ItemValue>
              <CompoundingText compounding={true}>
                <FormattedMessage id="general.yes" />
              </CompoundingText>
              &nbsp;
              <SecondaryText>
                <FormattedMessage id="wallet.staking.offer.compounding.info" />
              </SecondaryText>
            </ItemValue>
          </ListItem>
        </ul>
      </Modal>
    </CustomModal>
  );
};

export default VaultOfferModal;
