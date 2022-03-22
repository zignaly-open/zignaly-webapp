import React from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Box, FormHelperText, Tooltip } from "@mui/material";

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
    <Box alignItems="end" className="help" display="flex" flexDirection="row">
      <Tooltip
        arrow
        enterTouchDelay={50}
        placement="left-end"
        title={intl.formatMessage({ id: descriptionId })}
      >
        <FormHelperText>
          <FormattedMessage id={labelId} />
        </FormHelperText>
      </Tooltip>
    </Box>
  );
};

export default React.memo(HelperLabel);
