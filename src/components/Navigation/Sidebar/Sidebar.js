import React, { useState } from "react";
import "./Sidebar.scss";
import { Box, Typography } from "@material-ui/core";
import Link from "../../LocalizedLink";
import SignalWhite from "../../../images/sidebar/signalWhite.svg";
import SignalBlack from "../../../images/sidebar/signalBlack.svg";
import TerminalWhite from "../../../images/sidebar/terminalWhite.svg";
import TerminlBlack from "../../../images/sidebar/terminalBlack.svg";
import CopyWhite from "../../../images/sidebar/copyWhite.svg";
import CopyBlack from "../../../images/sidebar/copyBlack.svg";
import DashboardWhite from "../../../images/sidebar/dashboardWhite.svg";
import DashboardBlack from "../../../images/sidebar/dashboardBlack.svg";
import { FormattedMessage } from "react-intl";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import ThemeSwitcher from "../../ThemeSwitcher";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const Sidebar = () => {
  const storeSettings = useStoreSettingsSelector();
  const [hover, setHover] = useState(false);

  const showFullMenu = () => {
    setHover(true);
  };

  const showSmallMenu = () => {
    setHover(false);
  };

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
      alignItems="flex-start"
      bgcolor="grid.main"
      className={"sidebar " + (hover ? "full" : "")}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      onMouseEnter={showFullMenu}
      onMouseLeave={showSmallMenu}
      onMouseOver={showFullMenu}
    >
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/dashboard/positions"}
      >
        <img alt="zignaly" className={"icon"} src={getIcon("dashboard")} />
        <Typography variant="h6">
          <FormattedMessage id="menu.dashboard" />
        </Typography>
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/copyTraders/browse"}
      >
        <img alt="zignaly" className={"icon"} src={getIcon("copyTraders")} />
        <Typography variant="h6">
          <FormattedMessage id="menu.copytraders" />
        </Typography>
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/signalProviders/browse"}
      >
        <img alt="zignaly" className={"icon"} src={getIcon("signalProviders")} />
        <Typography variant="h6">
          <FormattedMessage id="menu.signalproviders" />
        </Typography>
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/tradingTerminal"}
      >
        <img alt="zignaly" className={"icon"} src={getIcon("tradingTerminal")} />
        <Typography variant="h6">
          <FormattedMessage id="menu.tradingterminal" />
        </Typography>
      </Link>
      <ThemeSwitcher full={hover} />
    </Box>
  );
};

export default Sidebar;
