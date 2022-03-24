import React, { useState } from "react";
import { Radio, RadioGroup, FormControlLabel, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import tradeApi from "../../../services/tradeApiClient";
import { showErrorAlert } from "../../../store/actions/ui";
import { FormattedMessage } from "react-intl";
import CustomButton from "components/CustomButton";

/**
 * @typedef {Object} DefaultProps
 * @property {string} token
 */

/**
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} JSx component.
 */
const ResetTwoFAForm = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [answer, setAnswer] = useState("");
  const dispatch = useDispatch();

  const submit = () => {
    setLoading(true);
    const payload = {
      token,
    };
    tradeApi
      .disable2FARequest(payload)
      .then(() => {
        setSuccess(true);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  return (
    <Box
      alignItems="center"
      className="resetTwoFAForm"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Box alignItems="start" display="flex" flexDirection="column">
        <Typography variant="h3">
          <FormattedMessage id="security.2fa.disable" />
        </Typography>
        <Typography>
          <FormattedMessage id="security.2fa.reset.question" />
        </Typography>
        <RadioGroup
          aria-label="answer"
          className="answers"
          name="answer"
          onChange={(e) => setAnswer(e.target.value)}
          value={answer}
        >
          <FormControlLabel
            control={<Radio />}
            label={<FormattedMessage id="general.yes" />}
            value="yes"
          />
          {answer === "yes" &&
            (!success ? (
              <CustomButton
                className="submitButton answerAction"
                loading={loading}
                onClick={submit}
              >
                <FormattedMessage id="security.2fa.reset.send" />
              </CustomButton>
            ) : (
              <Typography className="callout1 answerAction">
                <FormattedMessage id="security.2fa.reset.sent" />
              </Typography>
            ))}
          <FormControlLabel
            control={<Radio />}
            label={<FormattedMessage id="general.no" />}
            value="no"
          />
          {answer === "no" && (
            <Typography>
              <FormattedMessage id="security.2fa.reset.support" />
            </Typography>
          )}
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default ResetTwoFAForm;
