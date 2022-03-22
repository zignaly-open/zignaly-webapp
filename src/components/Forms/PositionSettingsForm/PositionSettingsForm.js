import React from "react";
import "./PositionSettingsForm.scss";
import { Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * @typedef {Object} DefaultProps
 * @property {React.MouseEventHandler} onClose
 * @param {DefaultProps} props
 */

const PositionSettingsForm = (props) => {
  const { onClose } = props;

  return (
    <Box
      alignItems="center"
      bgcolor="grid.main"
      className="positionSettingsForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <CloseIcon className="closeIcon" onClick={onClose} />
      <span className="boxTitle">Choose Columns</span>
      <Box className="form" />
    </Box>
  );
};

export default PositionSettingsForm;
