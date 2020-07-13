import React, { useState } from "react";
import "./MobileAppbar.scss";
import { Box, Slide } from "@material-ui/core";
import Link from "../../LocalizedLink";
import { useDispatch } from "react-redux";
import SignalWhite from "../../../images/sidebar/signalWhite.svg";
import SignalBlack from "../../../images/sidebar/signalBlack.svg";
import TerminalWhite from "../../../images/sidebar/terminalWhite.svg";
import TerminlBlack from "../../../images/sidebar/terminalBlack.svg";
import CopyWhite from "../../../images/sidebar/copyWhite.svg";
import CopyBlack from "../../../images/sidebar/copyBlack.svg";
import FillWhite from "../../../images/sidebar/fillWhite.svg";
import OutlineWhite from "../../../images/sidebar/outlineWhite.svg";
import DashboardWhite from "../../../images/sidebar/dashboardWhite.svg";
import DashboardBlack from "../../../images/sidebar/dashboardBlack.svg";
import PersonBlack from "../../../images/sidebar/personBlack.svg";
import PersonWhite from "../../../images/sidebar/personWhite.svg";
import CloseBlack from "../../../images/sidebar/closeBlack.svg";
import CloseWhite from "../../../images/sidebar/closeWhite.svg";
import { selectDarkTheme } from "../../../store/actions/settings";
import UserMenu from "../Header/UserMenu";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const MobileAppbar = () => {
  const [menu, showMenu] = useState(false);
  const storeSettings = useStoreSettingsSelector();
  const dispatch = useDispatch();

  /**
   *
   * @param {string} link
   * @returns {*}
   */
  const getIcon = (link) => {
    let url = "";
    if (typeof window !== undefined) {
      url = window.location.href;
    }
    switch (link) {
      case "dashboard":
        if (storeSettings.darkStyle) {
          return DashboardWhite;
        } else {
          if (url.includes(link)) {
            return DashboardWhite;
          } else {
            return DashboardBlack;
          }
        }
      case "copyTraders":
        if (storeSettings.darkStyle) {
          return CopyWhite;
        } else {
          if (url.includes(link)) {
            return CopyWhite;
          } else {
            return CopyBlack;
          }
        }
      case "signalProviders":
        if (storeSettings.darkStyle) {
          return SignalWhite;
        } else {
          if (url.includes(link)) {
            return SignalWhite;
          } else {
            return SignalBlack;
          }
        }
      case "tradingTerminal":
        if (storeSettings.darkStyle) {
          return TerminalWhite;
        } else {
          if (url.includes(link)) {
            return TerminalWhite;
          } else {
            return TerminlBlack;
          }
        }
      default:
        return "";
    }
  };

  return (
    <Box
      alignItems="center"
      bgcolor="grid.main"
      className="mobileAppbar"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Link
        activeClassName="active"
        className="sideBarLink"
        partiallyActive={true}
        to="/dashboard/positions"
      >
        <img alt="zignaly" className={"icon"} src={getIcon("dashboard")} />
      </Link>
      <Link
        activeClassName="active"
        className="sideBarLink"
        partiallyActive={true}
        to="/copyTraders/browse"
      >
        <img alt="zignaly" className="icon" src={getIcon("copyTraders")} />
      </Link>
      <Link
        activeClassName="active"
        className="sideBarLink"
        partiallyActive={true}
        to="/signalProviders/browse"
      >
        <img alt="zignaly" className="icon" src={getIcon("signalProviders")} />
      </Link>
      <Link
        activeClassName="active"
        className="sideBarLink"
        partiallyActive={true}
        to="/tradingTerminal"
      >
        <img alt="zignaly" className={"icon"} src={getIcon("tradingTerminal")} />
      </Link>
      <Box
        className="sideBarLink"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        onClick={() => showMenu(!menu)}
      >
        {!menu && (
          <img
            alt="zignaly"
            className="icon"
            src={storeSettings.darkStyle ? PersonWhite : PersonBlack}
          />
        )}
        {menu && (
          <img
            alt="zignaly"
            className="icon"
            src={storeSettings.darkStyle ? CloseWhite : CloseBlack}
          />
        )}
      </Box>
      <Box
        className={storeSettings.darkStyle ? "checkedDarkBox" : "checkedLightBox"}
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <img
          alt="zignaly"
          className="icon"
          onClick={() => dispatch(selectDarkTheme(!storeSettings.darkStyle))}
          src={storeSettings.darkStyle ? OutlineWhite : FillWhite}
        />
      </Box>
      <Slide direction="up" in={menu}>
        <Box bgcolor="grid.content" className="userMenuDrawer">
          <UserMenu />
        </Box>
      </Slide>
    </Box>
  );
};

export default MobileAppbar;
