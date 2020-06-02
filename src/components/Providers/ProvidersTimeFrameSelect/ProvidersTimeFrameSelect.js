import React from "react";
import { Box, Typography } from "@material-ui/core";
import TimeFrameSelect from "../../TimeFrameSelect";
import { FormattedMessage } from "react-intl";
import "./ProvidersTimeFrameSelect.scss";

/**
 * @typedef {Object} ProvidersTimeFrameSelectPropTypes
 * @property {function} onChange Callback that delegate timeframe changes to caller.
 * @property {number} value Selected value.
 * @property {boolean} copyTraders Flag used for the title.
 * @property {number} providersCount Providers count.
 */

/**
 * Provides row to display providers count with a dropdown to select timeframe.
 *
 * @param {ProvidersTimeFrameSelectPropTypes} props Component properties.
 * @returns {JSX.Element} Component JSX.
 */
const ProvidersTimeFrameSelect = ({ providersCount, copyTraders, onChange, value }) => (
  <Box
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    flexWrap="wrap"
    className="providersTimeFrameSelect"
  >
    <Typography className="providersCount" variant="h3">
      {providersCount}{" "}
      <FormattedMessage id={copyTraders ? "copyt.traders" : "menu.signalproviders"} />
    </Typography>
    <Box alignItems="center" display="flex" flexDirection="row" justifyContent="flex-end">
      <TimeFrameSelect onChange={onChange} value={value} />
    </Box>
  </Box>
);

export default ProvidersTimeFrameSelect;
