import { Box, Chip, Typography } from "@material-ui/core";
import { Link, DescriptionOutlined } from "@material-ui/icons";
import CustomModal from "components/Modal";
import React from "react";
import { Title, Modal } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import CoinIcon from "../CoinIcon";
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

const Coin = styled.span`
  color: #65647e;
  font-size: 14px;
  margin-left: 12px;
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
  margin-left: 18px;
`;

const MiniIconLink = styled.a.attrs(() => ({
  target: "_blank",
  rel: "noreferrer",
}))`
  display: flex;
  justify-content: center;
  margin-right: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${(props) => props.theme.newTheme.secondaryText};

  svg {
    margin-right: 4px;
  }
`;

const StyledModal = styled(Modal)`
  align-items: flex-start;
`;

interface ProjectDetailsModalProps {
  onClose: () => void;
  open: boolean;
  project: LaunchpadProject;
}

const formatUTC = (date: string) => dayjs(date, "YYYY-MM-DD").format("MMMM DD, YYYY hh:mm A UTC");
const formatDay = (date: string) => dayjs(date, "YYYY-MM-DD").format("MMM D, YYYY");

const ProjectDetailsModal = ({ onClose, open, project }: ProjectDetailsModalProps) => {
  const intl = useIntl();
  const { minAmount, name, coin, description, website, whitepaper, category } = project;

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <StyledModal>
        <Box display="flex" alignItems="center" mb={2}>
          <CoinIcon width={64} height={64} coin={coin} />
          <TitleDesc>{name}</TitleDesc>
          <Coin>{coin}</Coin>
        </Box>
        <Chip
          style={{ marginBottom: "12px" }}
          size="small"
          label={intl.formatMessage({ id: `zigpad.category.${category}` })}
        />
        <ItemValue>{description}</ItemValue>
        <Box display="flex" mt={2}>
          <MiniIconLink href={website}>
            <Link />
            <FormattedMessage id="srv.edit.website" />
          </MiniIconLink>
          <MiniIconLink href={whitepaper}>
            <DescriptionOutlined />
            <FormattedMessage id="zigpad.whitepaper" />
          </MiniIconLink>
        </Box>
        <ul>
          <ListItem>
            <ItemLabel>
              <FormattedMessage id="zigpad.minContribution" />
            </ItemLabel>
            <ItemValue>
              <NumberFormat
                displayType="text"
                value={minAmount}
                suffix=" ZIG"
                thousandSeparator={true}
              />
            </ItemValue>
          </ListItem>
          {/* <ListItem>
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
          </ListItem> */}
        </ul>
      </StyledModal>
    </CustomModal>
  );
};

export default ProjectDetailsModal;
