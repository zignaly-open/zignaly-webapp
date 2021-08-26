import React, { useState } from "react";
import {
  Slider,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import "./PrivacySlider.scss";
import usePrevious from "hooks/usePrevious";
import useStoreSettingsSelector from "hooks/useStoreSettingsSelector";

const options = {
  0: "unlisted",
  1: "listed_profile",
  2: "listed_marketplace",
};

/**
 * @param {string} value Value
 * @returns {number} key
 */
// @ts-ignore
const getKey = (value) => Object.keys(options).find((k) => options[k] === value);

/**
 * @typedef {Object} Options
 * @property {boolean} unlistedDisabled
 */

/**
 * @param {Object} props Props
 * @param {function} props.onChange Callback
 * @param {string} props.value Value
 * @param {Options} props.options options
 * @returns {JSX.Element} JSX
 */
const PrivacySlider = ({ onChange, value, options: { unlistedDisabled } }) => {
  // Using an array of values (to select Profile + MarketPlace) causes issue:
  // No event when switching between them
  // Hard to style Profile as not bold, no thumb
  // const [value, setValue] = React.useState([1, 2]);
  const [showMarketPlaceModal, setShowMarketPlaceModal] = useState(false);
  const previousValue = usePrevious(value);
  const valueNumber = getKey(value);
  const { darkStyle } = useStoreSettingsSelector();

  /**
   * @param {React.ChangeEvent<{}>} event Event
   * @param {number} newValue New Value
   * @returns {void}
   */
  const handleChange = (event, newValue) => {
    if ((newValue === 0 && !unlistedDisabled) || newValue === 1) {
      onChange(options[newValue]);
    } else if (newValue === 2) {
      onChange(options[newValue]);
      setShowMarketPlaceModal(true);
    }
  };

  const privacyMarks = [
    {
      value: 0,
      label: (
        <span className={unlistedDisabled ? "disabled" : ""}>
          <FormattedMessage id="srv.edit.privacy.unlisted" />
        </span>
      ),
    },
    {
      value: 1,
      label: <FormattedMessage id="srv.edit.privacy.listedProfile" />,
    },
    {
      value: 2,
      label: <FormattedMessage id="srv.edit.privacy.listedMarketplace" />,
    },
  ];

  const StyledSlider = withStyles({
    root: {
      // color: "#3880ff",
      // height: 2,
      // padding: "15px 0",
    },
    thumb: {
      height: 14,
      width: 14,
      // backgroundColor: "#fff",
      opacity: 1,
      backgroundColor: "currentColor",
      // "&:focus, &:hover, &$active": {
      //   boxShadow: "0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)",
      //   // Reset on touch devices, it doesn't add specificity
      //   "@media (hover: none)": {
      //     boxShadow: iOSBoxShadow,
      //   },
      // },
      // "&:not(.MuiSlider-thumb ~ .MuiSlider-thumb)": {
      //   display: "none",
      // },
    },
    markLabelActive: {
      color: darkStyle ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.54)",
      // Hack to only set the selected value in bold, not previous ones
      [`&[data-index="${valueNumber}"]`]: {
        fontWeight: 700,
        color: darkStyle ? "rgba(255, 255, 255, 0.94)" : "#191927",
      },
      // "&:not(.MuiSlider-markLabelActive ~ .MuiSlider-markLabelActive)": {
      //   fontWeight: 400,
      // },
    },
    // valueLabel: {
    //   left: "calc(-50% + 12px)",
    //   top: -22,
    //   "& *": {
    //     background: "transparent",
    //     color: "#000",
    //   },
    // },
    track: {
      height: 4,
      ...(valueNumber > 0 && {
        left: "50% !important",
        width: `${valueNumber > 1 ? "50%" : "0%"} !important`,
      }),
    },
    rail: {
      height: 4,
      // opacity: 0.5,
      // backgroundColor: "#bfbfbf",
    },
    mark: {
      backgroundColor: "#bfbfbf",
      height: 12,
      width: 1,
      marginTop: -3,
      // cursor: "pointer",
    },
    markLabel: {
      // transform: "none",
      whiteSpace: "normal",
      textAlign: "center",
      // cursor: "pointer",
    },
    markActive: {
      opacity: 1,
      backgroundColor: "currentColor",
      ...(valueNumber > 0 && {
        '&[data-index="0"]': {
          backgroundColor: "#bfbfbf",
        },
      }),
      ...(unlistedDisabled && {
        '&[data-index="0"]': {
          opacity: 0.5,
        },
      }),
    },
  })(Slider);

  const handleCloseModal = () => {
    setShowMarketPlaceModal(false);
    onChange(previousValue);
  };

  return (
    <>
      <Dialog onClose={handleCloseModal} open={showMarketPlaceModal}>
        <DialogContent>
          <DialogContentText color="textPrimary">
            <Box display="flex" flexDirection="column">
              <FormattedMessage id="srv.edit.list.tooltip" />
              <ul>
                <li>
                  <FormattedMessage id="srv.edit.list.1.tooltip" />
                </li>
                <li>
                  <FormattedMessage id="srv.edit.list.2.tooltip" />
                </li>
                <li>
                  <FormattedMessage id="srv.edit.list.4.tooltip" />
                </li>
              </ul>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseModal}>
            <FormattedMessage id="confirm.accept" />
          </Button>
        </DialogActions>
      </Dialog>
      <StyledSlider
        aria-labelledby="privacy-slider"
        className="privacySlider"
        marks={privacyMarks}
        max={2}
        onChange={handleChange}
        // defaultValue={[1, 2]}
        onChangeCommitted={handleChange}
        step={1}
        value={valueNumber}
        valueLabelDisplay="off"
      />
    </>
  );
};

export default PrivacySlider;
