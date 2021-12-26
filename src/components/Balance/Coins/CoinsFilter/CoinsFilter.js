import React, { useEffect, useState } from "react";
import "./CoinsFilter.scss";
import { Box, Checkbox } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").ExchangeAsset} ExchangeAsset
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Boolean} checked
 * @property {function(React.ChangeEvent<HTMLInputElement>):void} onChange
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const CoinsFilter = ({ checked, onChange }) => {
  return (
    <Box alignItems="center" className="coinsFilter" display="flex" flexDirection="row">
      <Checkbox
        checked={checked}
        inputProps={{ "aria-label": "Hide low value" }}
        onChange={onChange}
      />
      <FormattedMessage id="coins.filter.title" />
    </Box>
  );
};

export default CoinsFilter;
