import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Box, FormHelperText, Tooltip } from "@material-ui/core";
import { Help } from "@material-ui/icons";

/**
 * @typedef {Object} HelperLabelProps
 * @property {string} labelId Label translation text ID.
 * @property {string} descriptionId Description translation ID to display in tooltip.
 */

/**
 * Helper text with detailed description tooltip.
 *
 * @param {HelperLabelProps} props Component props.
 * @returns {JSX.Element} Helper label with description in tooltip element.
 */
const HelperLabel = (props) => {
  const { labelId, descriptionId } = props;
  const intl = useIntl();

  return (
    <Box alignItems="center" className="help" display="flex">
      <FormHelperText>
        <FormattedMessage id={labelId} />
      </FormHelperText>
      <Tooltip
        arrow
        enterTouchDelay={50}
        placement="left-end"
        title={intl.formatMessage({ id: descriptionId })}
      >
        <Help />
      </Tooltip>
    </Box>
  );
};

export default HelperLabel;
