import React, { useState } from "react";
import "./Header.scss";
import { Box, Popover, Grow, Typography } from "@material-ui/core";
import LogoWhite from "../../../images/logo/logoWhite.svg";
import LogoBlack from "../../../images/logo/logoBlack.svg";
import ProfileIcon from "../../../images/header/profileIcon.svg";
import { useSelector } from "react-redux";
import LanguageSwitcher from "../../LanguageSwitcher";
import LeftIcon from "../../../images/header/chevron-left.svg";
import RightIcon from "../../../images/header/chevron-right.svg";
import Link from "../../LocalizedLink";
import UserExchangeList from "./UserExchangeList";
import BalanceBox from "./BalanceBox";
import ConnectExchangeButton from "./ConnectExchangeButton";
import { FormattedMessage } from "react-intl";
import UserMenu from "./UserMenu";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

const Header = () => {
  const storeSettings = useStoreSettingsSelector();

  /**
   *
   * @param {DefaultState} state
   * @returns {Array<ExchangeConnectionEntity>}
   */

  const userExchangeSelector = (state) => state.user.exchangeConnections;
  const exchangeConnections = useSelector(userExchangeSelector);

  const [showBalance, setShowBalance] = useState(false);
  const [anchorEl, setAnchorEl] = useState(undefined);

  return (
    <Box
      alignItems="center"
      className={"header"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box alignItems="center" className={"logoContainer"} display="flex" flexDirection="row">
        <Link to="/dashboard/positions">
          <img
            alt="zignaly-logo"
            className={"headerLogo"}
            src={storeSettings.darkStyle ? LogoWhite : LogoBlack}
          />
        </Link>
        <LanguageSwitcher />
      </Box>
      <Box
        alignItems="center"
        className={"linksContainer"}
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        {exchangeConnections.length > 0 && (
          <Box
            alignItems="center"
            className={"balanceWrapper " + (showBalance ? "full" : "")}
            display="flex"
            flexDirection="row"
            justifyContent="flex-start"
          >
            <Box
              alignItems="center"
              className="iconBox"
              display="flex"
              flexDirection="row"
              justifyContent="center"
            >
              <img
                alt="zignaly"
                className={"expandIcon"}
                onClick={() => setShowBalance(!showBalance)}
                src={showBalance ? RightIcon : LeftIcon}
              />
            </Box>
            {showBalance && <BalanceBox />}
            {!showBalance && (
              <Grow in={true}>
                <Box
                  className="iconBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Typography variant="h4">
                    <FormattedMessage id="dashboard.balance" />
                  </Typography>
                </Box>
              </Grow>
            )}
          </Box>
        )}
        {exchangeConnections.length === 0 && <ConnectExchangeButton />}
        {exchangeConnections.length > 0 && <UserExchangeList />}
        <Box className="linkBox">
          <img
            alt="zignaly-user"
            className="icon"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            src={ProfileIcon}
          />
          <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            onClose={() => setAnchorEl(undefined)}
            open={Boolean(anchorEl)}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <UserMenu />
          </Popover>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
