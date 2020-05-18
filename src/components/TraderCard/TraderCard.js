import React from "react";
import "./TraderCard.scss";
import { Box } from "@material-ui/core";
import TraderCardHeader from "./TraderCardHeader";
import TraderCardBody from "./TraderCardBody";
import PropTypes from "prop-types";

const TraderCard = (props) => {
  const { data, showSummary } = props;

  return (
    <Box
      bgcolor="grid.main"
      className="traderCard"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <TraderCardHeader />
      <TraderCardBody data={data} showSummary={showSummary} />
    </Box>
  );
};

TraderCard.propTypes = {
  data: PropTypes.number.isRequired,
  showSummary: PropTypes.bool.isRequired,
};

export default TraderCard;
