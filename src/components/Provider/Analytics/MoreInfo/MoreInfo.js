import React from "react";
import "./MoreInfo.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CalendarIcon from "../../../../images/ct/calendar.svg";
import ExchangeIcon from "../../../../images/ct/exchange.svg";
import TimeIcon from "../../../../images/ct/time.svg";
import ProfitIcon from "../../../../images/ct/profit.svg";
import moment from "moment";
import { formatDuration } from "../../../../utils/format";

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */
/**
 * About us compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const MoreInfo = ({ provider }) => {
  return (
    <Box
      alignItems="flex-start"
      className="moreInfo"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <Typography variant="h3">
        <FormattedMessage id="srv.moreinfo" />
      </Typography>

      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
        flexWrap="wrap"
        className="infoBox"
      >
        <Box
          className="dataBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={ExchangeIcon} alt="zignaly" className="icon" />
          <Typography variant="h3" className="tagline">
            <FormattedMessage id="srv.tradesperweek" />
          </Typography>
          <Typography variant="h3">{provider.avgTradesPerWeek}</Typography>
        </Box>

        <Box
          className="dataBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={TimeIcon} alt="zignaly" className="icon" />
          <Typography variant="h3" className="tagline">
            <FormattedMessage id="srv.avgholdingtime" />
          </Typography>
          <Typography variant="h3">{formatDuration(provider.avgHoldingTime)}</Typography>
        </Box>

        <Box
          className="dataBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={CalendarIcon} alt="zignaly" className="icon" />
          <Typography variant="h3" className="tagline">
            <FormattedMessage id="srv.active" />
          </Typography>
          <Typography variant="h3">
            {moment(provider.activeSince).format("DD MMM, YYYY")}
          </Typography>
        </Box>

        <Box
          className="dataBox"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <img src={ProfitIcon} alt="zignaly" className="icon" />
          <Typography variant="h3" className="tagline">
            <FormattedMessage id="srv.profitableweeks" />
          </Typography>
          <Typography variant="h3">{provider.profitableWeeks}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MoreInfo;
