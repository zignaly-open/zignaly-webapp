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
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@material-ui/lab";
import { formatUTC } from "utils/format";
import DOMPurify from "dompurify";
import SocialIcon from "./SocialIcon";
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

const Coin = styled.span`
  color: #65647e;
  font-size: 14px;
  margin-left: 12px;
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

  span {
    margin-left: 4px;
  }
`;

const StyledModal = styled(Modal)`
  align-items: flex-start;
`;

const StyledTimeline = styled(Timeline)`
  width: 0;
  padding: 0;
`;

const TimelineLabel = styled.div`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-size: 16px;
  margin-bottom: 6px;
  width: 400px;
`;

const HtmlContent = styled.div`
  img {
    max-width: 90%;
  }
`;

interface ProjectDetailsModalProps {
  onClose: () => void;
  open: boolean;
  project: LaunchpadProject;
}

const ProjectDetailsModal = ({ onClose, open, project }: ProjectDetailsModalProps) => {
  const intl = useIntl();
  const {
    minAmount,
    name,
    coin,
    shortDescription,
    website,
    whitepaper,
    category,
    endDate,
    startDate,
    distributionDate,
  } = project;
  const details = DOMPurify.sanitize(project.details);

  return (
    <CustomModal
      onClose={onClose}
      newTheme={true}
      persist={false}
      size="large"
      state={open}
      style={{ width: "1000px" }}
    >
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
        <ItemValue>{shortDescription}</ItemValue>
        <Box display="flex" mt={2} mb={3}>
          <MiniIconLink href={website}>
            <Link />
            <FormattedMessage id="srv.edit.website" tagName="span" />
          </MiniIconLink>
          <MiniIconLink href={whitepaper}>
            <DescriptionOutlined />
            <FormattedMessage id="zigpad.whitepaper" tagName="span" />
          </MiniIconLink>
          {project.socials.map((s, i) => (
            <MiniIconLink href={s.url} key={i}>
              <SocialIcon type={s.name} />
            </MiniIconLink>
          ))}
        </Box>
        <Typography variant="h3">
          <FormattedMessage id="zigpad.subscriptionTimeline" />
        </Typography>
        <StyledTimeline>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineLabel>
                <FormattedMessage id="zigpad.subscriptionPeriod" />
              </TimelineLabel>
              <ItemValue>{formatUTC(startDate)}</ItemValue>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineLabel>
                <FormattedMessage id="zigpad.calculationPeriod" />
              </TimelineLabel>
              <ItemValue>{formatUTC(dayjs(endDate).add(1, "d").format())}</ItemValue>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot />
            </TimelineSeparator>
            <TimelineContent>
              <TimelineLabel>
                <FormattedMessage id="zigpad.distributionPeriod" />
              </TimelineLabel>
              <ItemValue>{formatUTC(distributionDate)}</ItemValue>
            </TimelineContent>
          </TimelineItem>
        </StyledTimeline>
        <Typography variant="h3">
          <FormattedMessage id="zigpad.contribute" />
        </Typography>
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
        </ul>
        <HtmlContent dangerouslySetInnerHTML={{ __html: details }} />
      </StyledModal>
    </CustomModal>
  );
};

export default ProjectDetailsModal;
