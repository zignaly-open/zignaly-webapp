import React, { useState } from "react";
import "./Header.scss";
import { Box, Menu, MenuItem, Grow, Typography } from "@material-ui/core";
import LogoWhite from "../../../images/logo/logoWhite.svg";
import LogoBlack from "../../../images/logo/logoBlack.svg";
import ProfileIcon from "../../../images/header/profileIcon.svg";
import { useSelector } from "react-redux";
import LanguageSwitcher from "../../LanguageSwitcher";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import CustomButton from "../../CustomButton";
import LeftIcon from "../../../images/header/chevron-left.svg";
import RightIcon from "../../../images/header/chevron-right.svg";
import Link from "../../LocalizedLink";
import UserExchangeList from "./UserExchangeList";
import { FormattedMessage } from "react-intl";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const Header = () => {
  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {boolean} Flag that indicates if darkStyle is enabled.
   */
  const selector = (state) => state.settings.darkStyle;
  const darkStyle = useSelector(selector);
  const [showBalance, setShowBalance] = useState(false);
  const [connected, setConnected] = useState(false);
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
            src={darkStyle ? LogoWhite : LogoBlack}
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
        <Box
          alignItems="center"
          className="balanceContainer"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
        >
          <Box className={"iconBox"} display="flex" flexDirection="column" justifyContent="center">
            <img
              alt="zignaly"
              className={"expandIcon"}
              onClick={() => setShowBalance(!showBalance)}
              src={showBalance ? RightIcon : LeftIcon}
            />
          </Box>
          {showBalance && (
            <Grow in={true}>
              <Box
                alignItems="center"
                display="flex"
                flexDirection="row"
                justifyContent="flex-start"
              >
                <Box
                  alignItems="flex-start"
                  className="blaanceBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography className="title" variant="subtitle1">
                    available balance
                  </Typography>
                  <Typography className="balance" variant="h5">
                    btc 0.256
                  </Typography>
                </Box>
                <Box
                  alignItems="flex-start"
                  className="blaanceBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography className="title" variant="subtitle1">
                    invested
                  </Typography>
                  <Typography className="balance" variant="h5">
                    btc 0.452
                  </Typography>
                </Box>
                <Box
                  alignItems="flex-start"
                  className="blaanceBox"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Typography className="title" variant="subtitle1">
                    p/l
                  </Typography>
                  <Typography className="balance green" variant="h5">
                    btc +0.47
                  </Typography>
                </Box>
              </Box>
            </Grow>
          )}
          {!showBalance && (
            <Grow in={true}>
              <Box
                className={"iconBox"}
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
        {!connected && (
          <CustomButton className="headerButton" onClick={() => setConnected(true)}>
            Connect Account
          </CustomButton>
        )}
        {connected && <UserExchangeList />}

        <Box className={"linkBox"}>
          <NotificationsNoneIcon className={"icon"} />
        </Box>
        <Box className={"linkBox"}>
          <img
            alt="zignaly-user"
            className={"icon"}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            src={ProfileIcon}
          />
          <Menu
            anchorEl={anchorEl}
            classes={{ paper: "menu" }}
            keepMounted
            onClose={() => setAnchorEl(undefined)}
            open={Boolean(anchorEl)}
          >
            <MenuItem
              classes={{ root: darkStyle ? "darkMenu" : "lightMenu" }}
              onClick={() => setAnchorEl(undefined)}
            >
              Profile
            </MenuItem>
            <MenuItem
              classes={{ root: darkStyle ? "darkMenu" : "lightMenu" }}
              onClick={() => setAnchorEl(undefined)}
            >
              My account
            </MenuItem>
            <MenuItem
              classes={{ root: darkStyle ? "darkMenu" : "lightMenu" }}
              onClick={() => setAnchorEl(undefined)}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
