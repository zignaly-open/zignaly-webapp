import { Box, Chip, CircularProgress, Typography } from "@material-ui/core";
import { Link, DescriptionOutlined, Check } from "@material-ui/icons";
import CustomModal from "components/Modal";
import React, { useContext, useEffect, useState } from "react";
import { Button, isMobile, Modal } from "styles/styles";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { css } from "styled-components";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from "@material-ui/lab";
import { formatDateTime } from "utils/format";
import SocialIcon from "./SocialIcon";
import PledgeModal from "./PledgeModal";
import tradeApi from "services/tradeApiClient";
import { PledgeButton } from "../Vault/VaultDepositButton";
import Countdown, { CountdownRenderProps, zeroPad } from "react-countdown";
import PrivateAreaContext from "context/PrivateAreaContext";
import WalletDepositView from "../WalletDepositView";
import { gateioUrl } from "utils/affiliateURLs";
import OpenArrowIcon from "images/launchpad/openArrow.inline.svg";
import useInterval from "hooks/useInterval";

const TitleContainer = styled(Box)`
  ${isMobile(css`
    margin-bottom: 6px;
  `)}
`;

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

const TimelineLabel = styled.div<{ active: boolean }>`
  color: ${(props) =>
    props.active ? props.theme.palette.primary.main : props.theme.newTheme.secondaryText};
  font-weight: ${(props) => (props.active ? 700 : 400)};
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

const StyledPledgeButton = styled.div`
  display: flex;
  justify-content: center;

  button {
    margin: 16px 42px;
    width: auto;
    min-width: 150px;
    min-height: 48px;

    ${isMobile(css`
      margin: 16px 0px 7px;
    `)}
  }
`;

const CountdownContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 3px;

  ${isMobile(`
    flex-direction: column;
    margin: 12px 0;
  `)}
`;

const CountdownPanel = styled(Typography)`
  background: ${(props) => props.theme.newTheme.backgroundAltColor};
  padding: 18px;
  max-width: 740px;
  border-radius: 4px;
  margin-top: 12px;

  ${isMobile(`
    text-align: center;
  `)}
`;

const CountdownText = styled(Typography)`
  margin-right: 80px;
  font-size: 16px;
  ${isMobile(`
    margin: 0 0 6px;
  `)}
`;

const CountdownDigit = styled(Typography)`
  font-size: 18px;
  ${({ theme }) => css`
    border: 1px solid ${theme.newTheme.borderColor2};
  `}
  padding: 4px;
  margin: 0 5px 0 17px;
  font-weight: 700;
`;

const ZigAmount = styled(Typography)`
  margin-bottom: 8px;
  span {
    font-weight: 700;
  }
`;

const Divider = styled.span`
  background: ${({ theme }) => (theme.palette.type === "dark" ? "#222249" : "#CCCAEF")};
  width: 1px;
  height: 100%;
  position: absolute;

  ${isMobile(`
    display: none;
  `)}
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
  margin-top: 18px;

  ${isMobile(`
    flex-direction: column;
    align-items: center;
  `)}
`;

const ButtonDesc = styled(Typography)`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  text-align: center;
  justify-content: space-between;

  ${isMobile(css`
    width: 100%;
    align-items: center;

    &:last-child {
      margin-top: 14px;
    }

    button,
    a {
      width: 200px;
    }
  `)}

  p {
    margin-bottom: 10px;
    font-size: 15px;
  }
`;

const StyledTimelineDot = styled(TimelineDot)`
  width: 24px;
  height: 24px;
  padding: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CheckIcon = styled(Check)`
  width: 18px;
  height: 18px;
`;

const CustomTimelineDot = ({
  done,
  active,
  step,
}: {
  done: boolean;
  active: boolean;
  step: number;
}) => {
  return (
    <StyledTimelineDot color={active ? "primary" : "grey"}>
      {done ? <CheckIcon /> : step}
    </StyledTimelineDot>
  );
};

interface ProjectDetailsModalProps {
  onClose: () => void;
  open: boolean;
  projectId: number;
}

const ProjectDetailsModal = ({ onClose, open, projectId }: ProjectDetailsModalProps) => {
  const [pledgeModal, showPledgeModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState<LaunchpadProjectDetails>(null);
  const intl = useIntl();
  const { walletBalance } = useContext(PrivateAreaContext);
  const balanceZIG = walletBalance?.ZIG?.total?.availableBalance || 0;
  const [depositZIG, showDepositZIG] = useState(false);
  const [coins, setCoins] = useState<WalletCoins>(null);
  const [step, setStep] = useState(1);
  const [rateZIG, setRateZIG] = useState(null);

  const getStep = () => {
    if (projectDetails) {
      if (dayjs().isAfter(projectDetails.distributionDate)) {
        // Distribution period
        return 5;
      }
      if (dayjs().isAfter(projectDetails.vestingDate)) {
        // Vesting period
        return 4;
      }
      if (dayjs().isAfter(projectDetails.calculationDate)) {
        // Calculation period
        return 3;
      }
      if (dayjs().isAfter(projectDetails.startDate)) {
        // Subscription period
        return 2;
      }
    }

    return 1;
  };

  useInterval(
    () => {
      setStep(getStep());
    },
    1000,
    false,
  );

  useEffect(() => {
    setStep(getStep());
  }, [projectDetails]);

  useEffect(() => {
    tradeApi.getLaunchpadProjectDetails(projectId).then((response) => {
      setProjectDetails(response);
    });

    tradeApi.getWalletCoins().then((response) => {
      setCoins(response);
    });
  }, []);

  useEffect(() => {
    tradeApi.getWalletCoins().then((response) => {
      setRateZIG(response.ZIG.usdPrice);
    });
  }, []);

  const onPledged = (amount: number) => {
    setProjectDetails({
      ...projectDetails,
      pledged: amount,
    });
    showPledgeModal(false);
  };

  const rendererCountdown = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a complete state
      // return <Completionist />;
      return "Done";
    }

    // Render a countdown
    return (
      <Box display="flex" alignItems="center">
        <CountdownDigit>{zeroPad(days)}</CountdownDigit>
        <FormattedMessage id="zigpad.days" />
        <CountdownDigit>{zeroPad(hours)}</CountdownDigit>
        <FormattedMessage id="zigpad.hours" />
        <CountdownDigit>{zeroPad(minutes)}</CountdownDigit>
        <FormattedMessage id="zigpad.mins" />
        <CountdownDigit>{zeroPad(seconds)}</CountdownDigit>
        <FormattedMessage id="zigpad.secs" />
      </Box>
    );
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
      <CustomModal
        onClose={() => showDepositZIG(false)}
        newTheme={true}
        persist={false}
        size="medium"
        state={depositZIG}
      >
        <WalletDepositView coins={coins} onClose={() => showDepositZIG(false)} coin="ZIG" />
      </CustomModal>
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
              <TitleContainer display="flex" alignItems="center">
                <img src={projectDetails.logo} width={64} height={64} />
                <TitleDesc>{projectDetails.name}</TitleDesc>
                <Coin>{projectDetails.coin}</Coin>
              </TitleContainer>
              {step === 2 && (
                <StyledPledgeButton>
                  <PledgeButton
                    onClick={() => showPledgeModal(true)}
                    pledged={projectDetails.pledged}
                  />
                </StyledPledgeButton>
              )}
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
                    suffix="$"
                    thousandSeparator={true}
                  />
                  {rateZIG ? (
                    <>
                      &nbsp;(
                      <NumberFormat
                        displayType="text"
                        value={projectDetails.price / rateZIG}
                        suffix=" ZIG"
                        prefix="≈"
                        thousandSeparator={true}
                        decimalScale={2}
                      />
                      )
                    </>
                  ) : (
                    "-"
                  )}
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
                  <CustomTimelineDot done={step > 1} active={step === 1} step={1} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <TimelineLabel active={step === 1}>
                    <FormattedMessage id="zigpad.getready" />
                  </TimelineLabel>
                  <ItemValue>{formatDateTime(projectDetails.getReadyDate)}</ItemValue>
                  {step === 1 && (
                    <>
                      <CountdownContainer>
                        <CountdownText>
                          <FormattedMessage id="zigpad.timeLeftStart" />
                        </CountdownText>
                        <Countdown date={projectDetails.startDate} renderer={rendererCountdown} />
                      </CountdownContainer>
                      <CountdownPanel>
                        <ZigAmount>
                          <FormattedMessage id="zigpad.youHave" />
                          &nbsp;
                          <NumberFormat
                            value={balanceZIG}
                            thousandSeparator={true}
                            displayType="text"
                            suffix=" ZIG"
                          />
                        </ZigAmount>
                        <ZigAmount>
                          <FormattedMessage id="zigpad.getMore" />
                        </ZigAmount>
                        <ButtonsContainer>
                          <ButtonBox>
                            <ButtonDesc>
                              <FormattedMessage id="zigpad.deposit.desc" />
                            </ButtonDesc>
                            <Button onClick={() => showDepositZIG(true)}>
                              <FormattedMessage id="accounts.deposit" />
                              &nbsp;ZIG
                            </Button>
                          </ButtonBox>
                          <Divider />
                          <ButtonBox>
                            <ButtonDesc>
                              <FormattedMessage id="zigpad.buy.desc" />
                            </ButtonDesc>
                            <Button href={gateioUrl} target="_blank" endIcon={<OpenArrowIcon />}>
                              <FormattedMessage id="zigpad.buy" />
                            </Button>
                          </ButtonBox>
                        </ButtonsContainer>
                      </CountdownPanel>
                    </>
                  )}
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <CustomTimelineDot done={step > 2} active={step === 2} step={2} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <TimelineLabel active={step === 2}>
                    <FormattedMessage id="zigpad.subscriptionPeriod" />
                  </TimelineLabel>
                  <ItemValue>{formatDateTime(projectDetails.startDate)}</ItemValue>
                  {step === 2 && (
                    <>
                      <CountdownContainer>
                        <CountdownText>
                          <FormattedMessage id="zigpad.timeLeftEnd" />
                        </CountdownText>
                        <Countdown
                          date={projectDetails.calculationDate}
                          renderer={rendererCountdown}
                        />
                      </CountdownContainer>
                      <CountdownPanel>
                        <FormattedMessage id="zigpad.subscription.participate" />
                        <StyledPledgeButton>
                          <PledgeButton
                            onClick={() => showPledgeModal(true)}
                            pledged={projectDetails.pledged}
                          />
                        </StyledPledgeButton>
                      </CountdownPanel>
                    </>
                  )}
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <CustomTimelineDot done={step > 3} active={step === 3} step={3} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <TimelineLabel active={step === 3}>
                    <FormattedMessage id="zigpad.calculationPeriod" />
                  </TimelineLabel>
                  <ItemValue>{formatDateTime(projectDetails.calculationDate)}</ItemValue>
                  {step === 3 && (
                    <CountdownContainer>
                      <CountdownText>
                        <FormattedMessage id="zigpad.calculation.progress" />
                      </CountdownText>
                    </CountdownContainer>
                  )}
                </TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineSeparator>
                  <CustomTimelineDot done={step > 4} active={step === 4} step={4} />
                </TimelineSeparator>
                <TimelineContent>
                  <TimelineLabel active={step === 4}>
                    <FormattedMessage id="zigpad.distributionPeriod" />
                  </TimelineLabel>
                  <ItemValue>{formatDateTime(projectDetails.distributionDate)}</ItemValue>
                  {step === 4 && (
                    <>
                      <CountdownContainer>
                        <CountdownText>
                          {dayjs().isBefore(projectDetails.distributionDate) ? (
                            <FormattedMessage id="zigpad.calculation.done" />
                          ) : (
                            <FormattedMessage id="zigpad.distribution.done" />
                          )}
                        </CountdownText>
                        <Countdown
                          date={projectDetails.distributionDate}
                          renderer={rendererCountdown}
                        />
                      </CountdownContainer>
                      <CountdownPanel>
                        {!projectDetails.pledged ? (
                          <FormattedMessage id="zigpad.calculation.missed" />
                        ) : dayjs().isBefore(projectDetails.distributionDate) ? (
                          <>
                            <FormattedMessage
                              id="zigpad.calculation.receive"
                              values={{
                                reward: projectDetails.tokenReward,
                                realPledged: projectDetails.pledged - projectDetails.returned,
                                date: dayjs(projectDetails.distributionDate).format("MMM D, YYYY"),
                              }}
                            />
                            {projectDetails.returned > 0 && (
                              <FormattedMessage
                                id="zigpad.calculation.returned"
                                values={{
                                  pledged: projectDetails.pledged,
                                  returned: projectDetails.returned,
                                }}
                                tagName="div"
                              />
                            )}
                          </>
                        ) : (
                          <FormattedMessage
                            id="zigpad.distribution.received"
                            values={{
                              reward: projectDetails.tokenReward,
                              realPledged: projectDetails.pledged - projectDetails.returned,
                            }}
                          />
                        )}
                      </CountdownPanel>
                    </>
                  )}
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
