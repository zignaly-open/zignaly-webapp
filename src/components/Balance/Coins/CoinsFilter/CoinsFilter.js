import React, { useState } from "react";
import "./CoinsFilter.scss";
import { Box, Checkbox } from "@material-ui/core";
import { useIntl, FormattedMessage } from "react-intl";
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

const CoinsFilter = (props) => {
  const { list, onChange } = props;
  const [checked, setChecked] = useState(false);
  const intl = useIntl();

  /**
   * Filter change handler.
   *
   * @param {React.ChangeEvent} e Change event.
   * @returns {Void} None.
   */
  const handleChange = (e) => {
    /*@ts-ignore */
    setChecked(e.target.checked);
    /*@ts-ignore */
    const data = filterData(e.target.checked);
    onChange(data);
  };

  /**
   * Filter Daily balance data
   *
   * @param {Boolean} checked
   * @returns {Array<UserExchangeAssetObject>}
   */

  const filterData = (checked) => {
    if (!checked) {
      return list;
    }

    let newList = [...list].filter((item) => {
      return parseFloat(item.balanceFree) > 0;
    });
    return newList;
  };

  return (
    <Box alignItems="center" className="coinsFilter" display="flex" flexDirection="row">
      <Checkbox
        checked={checked}
        onChange={handleChange}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
      <FormattedMessage id="coins.filter.title" />
    </Box>
  );
};

export default CoinsFilter;
