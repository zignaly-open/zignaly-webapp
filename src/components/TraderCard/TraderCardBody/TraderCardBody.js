import React from "react";
import "./TraderCardBody.scss";
import { Box, Typography } from "@material-ui/core";
import Chart from "../../Graphs/Chart";
import UserSummary from "../UserSummary";
import CustomButton from "../../CustomButton";
import PropTypes from "prop-types";
import { navigate } from "@reach/router";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {Object} TraderCardBodyPropTypes
 * @property {boolean} showSummary Flag to indicate if summary should be rendered.
 * @property {number} risk Return for open positions.
 * @property {number} returns Return for closed positions on the selected period.
 * @property {string} id Provider id.
 */

/**
 * Provides a body for a trader card.
 *
 * @param {TraderCardBodyPropTypes} props Component properties.
 * @returns {Object} Component JSX.
 */
const TraderCard = (props) => {
  const { id, showSummary, risk, returns } = props;
  let cardId = "traderCard" + id;

  return (
    <Box className="traderCardBody">
      <Box
        alignItems="center"
        className="returnsBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box
          className="returns"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography className="green" variant="h4">
            {returns}%
          </Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="returns(90D)" />
          </Typography>
        </Box>
        <Box
          alignItems="flex-end"
          className="openPositions"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Typography className="green" variant="h4">
            {risk}%
          </Typography>
          <Typography variant="subtitle1">
            <FormattedMessage id="srv.openpos" />
          </Typography>
        </Box>
      </Box>
      <Box className="traderCardGraph">
        <Chart id={cardId}>
          <canvas className="chartCanvas" id={cardId} />
        </Chart>
        <Box
          alignItems="center"
          className="actions"
          display="flex"
          flexDirection="row"
          justifyContent="space-around"
        >
          <CustomButton className="textDefault">
            <FormattedMessage id="trader.stop" />
          </CustomButton>
          <CustomButton className="textDefault" onClick={() => navigate("/copyTrader/profile")}>
            <FormattedMessage id="trader.view" />
          </CustomButton>
        </Box>
      </Box>
      {showSummary && <UserSummary />}
    </Box>
  );
};

TraderCard.propTypes = {
  id: PropTypes.string.isRequired,
  showSummary: PropTypes.bool.isRequired,
  risk: PropTypes.number.isRequired,
  returns: PropTypes.number.isRequired,
};

export default TraderCard;
