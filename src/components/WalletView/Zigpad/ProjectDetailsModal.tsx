import { Box, Chip, CircularProgress, Typography } from "@material-ui/core";
import { Link, DescriptionOutlined } from "@material-ui/icons";
import CustomModal from "components/Modal";
import React, { useEffect, useState } from "react";
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
import SocialIcon from "./SocialIcon";
import PledgeModal from "./PledgeModal";
import tradeApi from "services/tradeApiClient";
import { PledgeButton } from "../Vault/VaultDepositButton";

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
  margin: 0;

  .MuiTimelineItem-missingOppositeContent:before {
    flex: initial;
  }
`;

const TimelineLabel = styled.div`
  color: ${(props) => props.theme.newTheme.secondaryText};
  font-size: 16px;
  margin-bottom: 6px;
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

const Subtitle = styled(Typography).attrs(() => ({
  variant: "h3",
}))`
  margin: 26px 0 14px;
`;

const List = styled.ul`
  list-style-position: inside;
  padding-left: 0;
  margin: 0;

  li:last-child {
    margin-bottom: 0;
  }
`;

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

interface ProjectDetailsModalProps {
  onClose: () => void;
  open: boolean;
  projectId: number;
}

const ProjectDetailsModal = ({ onClose, open, projectId }: ProjectDetailsModalProps) => {
  const [pledgeModal, showPledgeModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState<LaunchpadProjectDetails>(null);
  const intl = useIntl();

  useEffect(() => {
    tradeApi.getLaunchpadProjectDetails(projectId).then((response) => {
      setProjectDetails(response);
    });
  }, []);

  const onPledged = (amount: number) => {
    setProjectDetails({
      ...projectDetails,
      pledged: amount,
    });
  };

  return (
    <CustomModal
      onClose={onClose}
      newTheme={true}
      persist={false}
      size="large"
      state={open}
      style={!isMobile ? { width: "1000px" } : null}
    >
      <StyledModal>
        {projectDetails ? (
          <>
            <CustomModal
              onClose={() => showPledgeModal(false)}
              size="small"
              state={pledgeModal}
              newTheme={true}
            >
              <PledgeModal project={projectDetails} onPledged={onPledged} />
            </CustomModal>
            <CoinBox display="flex" justifyContent="space-between" width={1} mb={2}>
              <Box display="flex" alignItems="center">
                <img src={projectDetails.logo} width={64} height={64} />
                <TitleDesc>{projectDetails.name}</TitleDesc>
                <Coin>{projectDetails.coin}</Coin>
              </Box>
              <PledgeButton
                onClick={() => showPledgeModal(true)}
                pledged={projectDetails.pledged}
              />
            </CoinBox>
            <Chip
              style={{ marginBottom: "12px" }}
              size="small"
              label={intl.formatMessage({
                id: `zigpad.category.${projectDetails.category.toLowerCase()}`,
              })}
            />
            <ItemValue>{projectDetails.shortDescription}</ItemValue>
            <Box display="flex" mt={2} mb={3}>
              <MiniIconLink href={projectDetails.website}>
                <Link />
                <FormattedMessage id="srv.edit.website" tagName="span" />
              </MiniIconLink>
              <MiniIconLink href={projectDetails.whitepaper}>
                <DescriptionOutlined />
                <FormattedMessage id="zigpad.whitepaper" tagName="span" />
              </MiniIconLink>
              {projectDetails.socials.map((s, i) => (
                <MiniIconLink href={s.url} key={i}>
                  <SocialIcon type={s.name} />
                </MiniIconLink>
              ))}
            </Box>
            <Subtitle>
              <FormattedMessage id="zigpad.subscriptionInfo" />
            </Subtitle>
            <MetricsBox display="flex">
              <MetricDetails>
                <MetricLabel>
                  <FormattedMessage id="terminal.price" />
                </MetricLabel>
                <MetricItem>
                  <NumberFormat
                    displayType="text"
                    value={projectDetails.price}
                    prefix={`1 ${projectDetails.coin} = `}
                    suffix=" ZIG"
                    thousandSeparator={true}
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
                    value={projectDetails.offeredAmount}
                    suffix={` ${projectDetails.coin}`}
                    thousandSeparator={true}
                  />
                </MetricItem>
              </MetricDetails>
              <MetricDetails>
                <MetricLabel>
                  <FormattedMessage id="zigpad.minContribution" />
                </MetricLabel>
                <MetricItem>
                  <NumberFormat
                    displayType="text"
                    value={projectDetails.minAmount}
                    suffix=" ZIG"
                    thousandSeparator={true}
                  />
                </MetricItem>
              </MetricDetails>
              <MetricDetails>
                <MetricLabel>
                  <FormattedMessage id="zigpad.maxContribution" />
                </MetricLabel>
                <MetricItem>
                  <NumberFormat
                    displayType="text"
                    value={projectDetails.maxAmount}
                    suffix=" ZIG"
                    thousandSeparator={true}
                  />
                </MetricItem>
              </MetricDetails>
            </MetricsBox>
            <Subtitle>
              <FormattedMessage id="zigpad.subscriptionTimeline" />
            </Subtitle>
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
                  <ItemValue>{formatUTC(projectDetails.startDate)}</ItemValue>
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
                  <ItemValue>
                    {formatUTC(dayjs(projectDetails.endDate).add(1, "d").format())}
                  </ItemValue>
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
                  <ItemValue>{formatUTC(projectDetails.distributionDate)}</ItemValue>
                </TimelineContent>
              </TimelineItem>
            </StyledTimeline>
            <Subtitle>
              <FormattedMessage id="zigpad.highlights" />
            </Subtitle>
            <Typography>{projectDetails.highlights}</Typography>
            <Subtitle>
              <FormattedMessage id="zigpad.tokenomic" />
            </Subtitle>
            <List>
              <ListItem>
                <ItemLabel>
                  <FormattedMessage id="zigpad.tokenomic.supply" />
                </ItemLabel>
                <ItemValue>
                  <NumberFormat
                    value={projectDetails.tokenomic.supplyTotalCap}
                    thousandSeparator={true}
                    displayType="text"
                    suffix={` ${projectDetails.coin}`}
                  />
                </ItemValue>
              </ListItem>
              <ListItem>
                <ItemLabel>
                  <FormattedMessage id="zigpad.tokenomic.supplyInitial" />
                </ItemLabel>
                <ItemValue>{projectDetails.tokenomic.supplyInitial}</ItemValue>
              </ListItem>
              <ListItem>
                <ItemLabel>
                  <FormattedMessage id="zigpad.tokenomic.type" />
                </ItemLabel>
                <ItemValue>{projectDetails.tokenomic.chain}</ItemValue>
              </ListItem>
            </List>
            <Subtitle>
              <FormattedMessage id="zigpad.distribution" />
            </Subtitle>
            <Typography>todo</Typography>
            <Subtitle>
              <FormattedMessage id="zigpad.rules" />
            </Subtitle>
            <Typography>todo</Typography>
          </>
        ) : (
          <CircularProgress size={50} style={{ margin: "0 auto" }} />
        )}
      </StyledModal>
    </CustomModal>
  );
};

export default ProjectDetailsModal;
