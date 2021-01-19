import React from "react";
import { Box, MenuItem } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setSelectedExchange } from "../../../../store/actions/settings";
import { FormattedMessage } from "react-intl";
import ExchangeIcon from "../../../ExchangeIcon";
import { useStoreUserExchangeConnections } from "../../../../hooks/useStoreUserSelector";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import useStoreSessionSelector from "../../../../hooks/useStoreSessionSelector";
import { getDailyUserBalance } from "../../../../store/actions/user";

/**
 * @typedef {import('../../../../store/initialState').DefaultState} DefaultState
 * @typedef {import("../../../../store/initialState").ExchangeConnectionEntity} ExchangeConnectionEntity
 */

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Function} [onClose]
 */

/**
 *
 * @param {DefaultProps} props
 */

const ExchangeList = (props) => {
  const { onClose } = props;
  const storeSettings = useStoreSettingsSelector();
  const storeSession = useStoreSessionSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const dispatch = useDispatch();

  /**
   * Select change handler.
   *
   * @param {ExchangeConnectionEntity} item Change event.
   *
   * @returns {Void} No return.
   */
  const handleClick = (item) => {
    dispatch(setSelectedExchange(item));
    const payload = {
      token: storeSession.tradeApi.accessToken,
      exchangeInternalId: item.internalId,
    };
    dispatch(getDailyUserBalance(payload));
    if (onClose) {
      onClose();
    }
  };

  return (
    <Box alignItems="flex-start" className="exchangeList" display="flex" flexDirection="column">
      {exchangeConnections &&
        exchangeConnections.map((item, index) => (
          <MenuItem
            className={
              "exchangeListItem " +
              (storeSettings.selectedExchange.internalId === item.internalId ? "selected" : "")
            }
            key={index}
            onClick={() => handleClick(item)}
            value={item.internalId}
          >
            <ExchangeIcon exchange={item.name.toLowerCase()} size="small" />
            <span className="name"> {item.internalName} </span>
            {item.paperTrading && (
              <span className="tag">
                (<FormattedMessage id="menu.demo" />)
              </span>
            )}
            {item.isTestnet && (
              <span className="tag">
                (<FormattedMessage id="menu.testnet" />)
              </span>
            )}
          </MenuItem>
        ))}
    </Box>
  );
};

export default ExchangeList;
