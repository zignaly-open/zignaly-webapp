import React from "react";
import { Box, FormControl, Select, MenuItem } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedExchange } from "../../../store/actions/settings";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../ExchangeIcon";
import MyExchange from "../../../images/header/myExchange.svg";
import { openExchangeConnectionView } from "../../../store/actions/ui";
import useStoreExchangeConnectionSelector from "../../../hooks/useStoreExchangeConnectionSelector";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const UserExchangeList = () => {
  const storeUser = useStoreExchangeConnectionSelector();
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();
  /**
   * Select change handler.
   *
   * @param {React.ChangeEvent<{name: string, value: string}>} event Change event.
   *
   * @returns {Void} No return.
   */
  const handleChange = (event) => {
    let found = [...storeUser.exchangeConnections].find(
      (item) => item.internalId === event.target.value,
    );
    if (found) {
      dispatch(setSelectedExchange(found));
    }
  };

  return (
    <Box className="userExchangeList">
      <FormControl className="selectInput" variant="outlined">
        <Select
          classes={{ root: "root" }}
          onChange={handleChange}
          value={storeSettings.selectedExchange.internalId}
        >
          {storeUser.exchangeConnections &&
            storeUser.exchangeConnections.map((item, index) => (
              <MenuItem
                className="exchangeListItem"
                classes={{ selected: "selected" }}
                key={index}
                value={item.internalId}
              >
                <ExchangeIcon exchange={item.name.toLowerCase()} size="small" />
                <span className="name"> {item.internalName} </span>
                {item.paperTrading && (
                  <span className="name">
                    (<FormattedMessage id="menu.demo" />){" "}
                  </span>
                )}
              </MenuItem>
            ))}
          <MenuItem
            className="exchangeListItem action"
            onClick={() => dispatch(openExchangeConnectionView(true))}
          >
            <img src={MyExchange} alt="zignaly" />
            <span className="name">
              <FormattedMessage id="menu.manageaccounts" />
            </span>
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default UserExchangeList;
