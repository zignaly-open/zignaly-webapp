import React, { useState } from "react";
import "./CoinsFilter.scss";
import { Box, Checkbox } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
/**
 *
 * @typedef {import("../../../../services/tradeApiClient.types").UserExchangeAssetObject} UserExchangeAssetObject
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<UserExchangeAssetObject>} list
 * @property {Function} onChange
 */

/**
 *
 * @param {DefaultProps} props Default props.
 */

const CoinsFilter = ({ list, onChange }) => {
  const [checked, setChecked] = useState(false);

  /**
   * Filter change handler.
   *
   * @param {React.ChangeEvent} e Change event.
   * @returns {Void} None.
   */
  const handleChange = (e) => {
    /* @ts-ignore */
    setChecked(e.target.checked);
    /* @ts-ignore */
    const data = filterData(e.target.checked);
    onChange(data);
  };

  /**
   * Filter Daily balance data
   *
   * @param {Boolean} value
   * @returns {Array<UserExchangeAssetObject>}
   */

  const filterData = (value) => {
    if (!value) {
      return list;
    }

    let newList = [...list].filter((item) => {
      return parseFloat(item.balanceTotal) > 0;
    });
    return newList;
  };

  return (
    <Box alignItems="center" className="coinsFilter" display="flex" flexDirection="row">
      <Checkbox
        checked={checked}
        inputProps={{ "aria-label": "primary checkbox" }}
        onChange={handleChange}
      />
      <FormattedMessage id="coins.filter.title" />
    </Box>
  );
};

export default CoinsFilter;
