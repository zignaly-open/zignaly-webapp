import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Box } from "@material-ui/core";
import TraderCard from "../../../components/TraderCard";

const ProvidersList = ({ providers }) => {
  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-start">
      <Box
        alignItems="center"
        className="tradersBox"
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
      >
        {providers &&
          providers.map((item) => <TraderCard data={item} key={item} showSummary={false} />)}
      </Box>
    </Box>
  );
};

ProvidersList.propTypes = {
  providers: PropTypes.array.isRequired,
};

export default ProvidersList;
