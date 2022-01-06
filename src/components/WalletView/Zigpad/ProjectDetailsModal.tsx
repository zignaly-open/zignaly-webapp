import { Box, Chip, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link, DescriptionOutlined } from "@material-ui/icons";
import CustomModal from "components/Modal";
import React, { useState } from "react";
import { isMobile, Modal } from "styles/styles";
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
import CustomButton from "components/CustomButton";
import PledgeModal from "./PledgeModal";

const MetricDetails = styled.div`
  margin-right: 80px;
`;

const MetricItem = styled(Typography)`
  font-weight: 600;
  margin-bottom: 16px;
`;

const MetricLabel = styled(Typography)`
  font-weight: 600;
  color: ${(props) => props.theme.newTheme.secondaryText};
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

  ${isMobile(css`
    margin-bottom: 40px;
  `)}
`;

const StyledTimeline = styled(Timeline)`
  width: 100%;
  padding: 0;

  .MuiTimelineItem-missingOppositeContent:before {
    flex: initial;
  }
`;

const TimelineLabel = styled.div`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-size: 16px;
  margin-bottom: 6px;
`;

const HtmlContent = styled(Typography)`
  img {
    max-width: 90%;
  }

  ${isMobile(css`
    img {
      max-width: 100%;
    }
  `)}
`;

const Button = styled(CustomButton)`
  margin: 16px 42px;

  && {
    min-width: 150px;
  }

  ${isMobile(css`
    margin: 16px 0px 7px;

    && {
      width: auto;
    }
  `)}
`;

const MetricsBox = styled(Box)`
  ${isMobile(css`
    flex-direction: column;
  `)}
`;

const CoinBox = styled(Box)`
  ${isMobile(css`
    flex-direction: column;
    align-items: flex-start;
  `)}
`;

// Force apply mui heading styles to html content
const useStyles = makeStyles((theme) => {
  const tags = ["h1", "h2", "h3", "h4", "h5", "h6"];
  const nestedRules = {};
  tags.forEach((tag) => {
    nestedRules[`& ${tag}`] = { ...theme.typography[tag] };
  });
  return {
    root: nestedRules,
  };
});

interface ProjectDetailsModalProps {
  onClose: () => void;
  open: boolean;
  project: LaunchpadProject;
}

const ProjectDetailsModal = ({ onClose, open, project }: ProjectDetailsModalProps) => {
  const [pledgeModal, showPledgeModal] = useState(false);
  const intl = useIntl();
  const {
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

  const classes = useStyles();

  return (
    <CustomModal
      onClose={onClose}
      newTheme={true}
      persist={false}
      size="large"
      state={open}
      style={!isMobile ? { width: "1000px" } : null}
    >
      <CustomModal
        onClose={() => showPledgeModal(false)}
        size="small"
        state={pledgeModal}
        newTheme={true}
      >
        <PledgeModal project={project} />
      </CustomModal>
      <StyledModal>
        <CoinBox display="flex" justifyContent="space-between" width={1} mb={2}>
          <Box display="flex" alignItems="center">
            <CoinIcon width={64} height={64} coin={coin} />
            <TitleDesc>{name}</TitleDesc>
            <Coin>{coin}</Coin>
          </Box>
          <Button className="bgPurple" onClick={() => showPledgeModal(true)}>
            <FormattedMessage id="zigpad.contribute" />
          </Button>
        </CoinBox>
        <Chip
          style={{ marginBottom: "12px" }}
          size="small"
          label={intl.formatMessage({ id: `zigpad.category.${category}` })}
        />
        <ItemValue>{shortDescription}</ItemValue>
        <Box display="flex" mt={2} mb={4}>
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
          <FormattedMessage id="zigpad.subscriptionInfo" />
        </Typography>
        <MetricsBox display="flex" mt={2} mb={4}>
          <MetricDetails>
            <MetricLabel>
              <FormattedMessage id="terminal.price" />
            </MetricLabel>
            <MetricItem>
              <NumberFormat
                displayType="text"
                value={project.price}
                prefix={`1 ${project.coin} = `}
                suffix=" ZIG"
              />
            </MetricItem>
          </MetricDetails>
          <MetricDetails>
            <MetricLabel>
              <FormattedMessage id="zigpad.offered" />
            </MetricLabel>
            <MetricItem>
              <NumberFormat
                displayType="text"
                value={project.offeredAmount}
                suffix={` ${project.coin}`}
              />
            </MetricItem>
          </MetricDetails>
          <MetricDetails>
            <MetricLabel>
              <FormattedMessage id="zigpad.minContribution" />
            </MetricLabel>
            <MetricItem>
              <NumberFormat displayType="text" value={project.minAmount} suffix=" ZIG" />
            </MetricItem>
          </MetricDetails>
        </MetricsBox>
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
        <HtmlContent
          className={classes.root}
          variant="body1"
          dangerouslySetInnerHTML={{ __html: details }}
        />
      </StyledModal>
    </CustomModal>
  );
};

export default ProjectDetailsModal;
