import React, { useState } from "react";
import "./ModifyUserSubscription.scss";
import { Box, Typography, Slider } from "@material-ui/core";
import CustomButton from "../../CustomButton/CustomButton";
import { FormattedMessage } from "react-intl";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import useStoreSessionSelector from "../../../hooks/useStoreSessionSelector";
import tradeApi from "../../../services/tradeApiClient";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "../../../store/actions/ui";

/**
 * Provides a table to display providers' profits stats.
 *
 * @typedef {Object} DefaultProps
 * @property {String} followerId
 * @property {*} onClose
 * @property {Function} loadData
 *
 *
 * @param {DefaultProps} props Component props.
 * @returns {JSX.Element} Component JSX.
 */

const ModifyUserSubscription = ({ followerId, onClose, loadData }) => {
  const storeViews = useStoreViewsSelector();
  const storeSession = useStoreSessionSelector();
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  /**
   * Function to submit user data.
   *
   * @returns {void} None.
   */
  const onSubmit = () => {
    setLoading(true);
    const payload = {
      token: storeSession.tradeApi.accessToken,
      providerId: storeViews.provider.id,
      followerId: followerId,
      days: days,
    };

    tradeApi
      .modifySubscription(payload)
      .then((response) => {
        if (response) {
          setLoading(false);
          loadData();
        }
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  /**
   * Function to increment days.
   *
   * @returns {void} None.
   */
  const increment = () => {
    if (days) {
      setDays(days + 1);
    }
  };

  /**
   * Function to decrement days.
   *
   * @returns {void} None.
   */
  const decrement = () => {
    if (days) {
      setDays(days - 1);
    }
  };

  /**
   *
   * @param {React.ChangeEvent} e
   * @param {Number} val
   */
  const handleDaysChange = (e, val) => {
    setDays(val);
  };

  return (
    <Box className="modifyUserSubscription" display="flex" flexDirection="column">
      <Box
        className="formBox"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h4">
          <FormattedMessage id="users.modify.title" />
        </Typography>

        <Box
          className="addSubBox"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <RemoveCircleIcon onClick={decrement} className="addIcon" color="primary" />
          <Typography variant="h3">
            {days} {days > 1 ? "Days" : "Day"}{" "}
          </Typography>
          <AddCircleIcon onClick={increment} className="addIcon" color="primary" />
        </Box>

        <Slider
          className="sliderInput"
          value={days}
          onChange={handleDaysChange}
          step={1}
          min={1}
          max={100}
        />
      </Box>
      <Box className="formAction" display="flex" flexDirection="row" justifyContent="flex-end">
        <CustomButton onClick={onSubmit} loading={loading} className="submitButton">
          update
        </CustomButton>
        <CustomButton onClick={onClose} className="textButton">
          cancel
        </CustomButton>
      </Box>
    </Box>
  );
};

export default ModifyUserSubscription;
