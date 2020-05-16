import React from "react";
import "./PositionSettingsForm.scss";
import { Box } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import CloseIcon from "@material-ui/icons/Close";

const PositionSettingsForm = (props) => {
  const handleSubmit = () => {};

  return (
    <Box
      bgcolor="grid.main"
      className="positionSettingsForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <CloseIcon className="closeIcon" />
      <span className="boxTitle">Choose Columns</span>
      <Box className="form"></Box>
      <Box className="input-box" display="flex" flexDirection="row" justifyContent="center">
        <CustomButton className={"submitbutton"} onClick={handleSubmit}>
          Save Preference
        </CustomButton>
      </Box>
    </Box>
  );
};

export default PositionSettingsForm;
