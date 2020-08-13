import React from "react";
import "./NoPositions.scss";
import { Box, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import CustomButton from "../../CustomButton";
import { navigate } from "gatsby";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 */

/**
 * @typedef {Object} DefaultProps
 * @property {Boolean} [isProfile]
 * @property {PositionsCollectionType} type
 */

/**
 * Component displayed when there are no positions.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const NoPositions = ({ isProfile, type }) => {
  const redirect = () => {
    navigate("/copyTraders");
  };

  const emptyMessage = () => {
    switch (type) {
      case "open":
        return "dashboard.positions.nopositions.open";
      case "closed":
        return "dashboard.positions.nopositions.closed";
      case "log":
        return "dashboard.positions.nopositions.log";
      case "profileOpen":
        return "dashboard.positions.nopositions.profileOpen";
      case "profileClosed":
        return "dashboard.positions.nopositions.profileClosed";
      default:
        return "dashboard.positions.nopositions.open";
    }
  };

  return (
    <Box
      alignItems="center"
      className="noPositions"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Typography variant="h3">
        <FormattedMessage id={emptyMessage()} />
      </Typography>
      {!isProfile && (
        <CustomButton className="submitButton" onClick={redirect}>
          <FormattedMessage id="dashboard.browsetraders" />
        </CustomButton>
      )}
    </Box>
  );
};

export default NoPositions;
