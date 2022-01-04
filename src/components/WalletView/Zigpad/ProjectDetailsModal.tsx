import { Box, Chip, Typography } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link, DescriptionOutlined } from "@material-ui/icons";
import CustomModal from "components/Modal";
import React, { useContext, useEffect } from "react";
import { Title, Modal } from "styles/styles";
import tradeApi from "services/tradeApiClient";
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
import AmountControl from "../AmountControl";
import PrivateAreaContext from "context/PrivateAreaContext";
import CustomButton from "components/CustomButton";
import { useForm } from "react-hook-form";

const MetricDetails = styled.div`
  margin-right: 80px;
`;

const MetricItem = styled(Typography)`
  font-weight: 600;
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

const HtmlContent = styled(Typography)`
  img {
    max-width: 90%;
  }
`;

const Button = styled(CustomButton)`
  margin: 16px 0;
  min-width: 150px;
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
  const { walletBalance, setWalletBalance } = useContext(PrivateAreaContext);
  const ZIGAmount = walletBalance?.ZIG?.total || { balance: 0, availableBalance: 0 };
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
  const {
    handleSubmit,
    register,
    control,
    errors,
    formState: { isValid },
    setValue,
    trigger,
  } = useForm({ mode: "onChange" });

  const pledge = () => {};

  useEffect(() => {
    tradeApi.getWalletBalance().then((response) => {
      setWalletBalance(response);
    });
  }, []);

  const setBalanceMax = () => {
    setValue("amount", ZIGAmount.availableBalance);
    trigger("amount");
  };

  const classes = useStyles();

  return (
    <CustomModal
      onClose={onClose}
      newTheme={true}
      persist={false}
      size="large"
      state={open}
      style={{ width: "1000px" }}
    >
      <form onSubmit={handleSubmit(pledge)}>
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
            <FormattedMessage id="zigpad.subscriptionInfo" />
          </Typography>
          <Box display="flex" mt={2} mb={3}>
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
                <NumberFormat displayType="text" value={project.minAmount} suffix={` ZIG`} />
              </MetricItem>
            </MetricDetails>
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
          <AmountControl
            balance={ZIGAmount}
            setBalanceMax={setBalanceMax}
            decimals={2}
            errors={errors}
            control={control}
            coin="ZIG"
            label="zigpad.contribute.amount"
            newDesign={true}
            minAmount={minAmount}
          />
          <Button className="bgPurple" type="submit" disabled={!isValid}>
            <FormattedMessage id="zigpad.contribute" />
          </Button>
          <HtmlContent
            className={classes.root}
            variant="body1"
            dangerouslySetInnerHTML={{ __html: details }}
          />
        </StyledModal>
      </form>
    </CustomModal>
  );
};

export default ProjectDetailsModal;
