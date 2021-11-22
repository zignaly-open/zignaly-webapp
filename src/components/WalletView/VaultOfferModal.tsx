import { Box, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import { formatUTC } from "utils/format";
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
  vault: Vault;
}

const VaultOfferModal = ({ onClose, open, vault }: VaultOfferModalProps) => {
  const { coin, coinReward, startDate, lockupDate, minDeposit, maxDeposit, rewardsTotal } = vault;
  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal p={5}>
        <Title>
          <Box alignItems="center" display="flex">
            <img src={PiggyIcon} width={40} height={40} />
            <FormattedMessage id="wallet.staking.offer.title" />
          </Box>
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
              <NumberFormat displayType="text" value={minDeposit} suffix={` ${coinReward}`} />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.maxDeposit" />
            </ItemLabel>
            <ItemValue>
              {maxDeposit ? (
                <NumberFormat displayType="text" value={maxDeposit} suffix={` ${coinReward}`} />
              ) : (
                <FormattedMessage id="wallet.staking.offer.none" />
              )}
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.rewardBegins" />
            </ItemLabel>
            {/* <ItemValue>{dayjs(vault.startDate).format("L LT")}</ItemValue> */}
            <ItemValue>{formatUTC(startDate)}</ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.rewardEnds" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage
                id="wallet.staking.offer.rewardEnds.val"
                values={{ coin: coinReward, amount: rewardsTotal }}
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
              <FormattedMessage id="wallet.staking.offer.awarded.val" />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.calculation" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage id="wallet.staking.offer.calculation.val" />
            </ItemValue>
          </ListItem>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="wallet.staking.offer.firstAwarded" />
            </ItemLabel>
            <ItemValue>
              <FormattedMessage id="wallet.staking.offer.firstAwarded.val" />
            </ItemValue>
          </ListItem>
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
