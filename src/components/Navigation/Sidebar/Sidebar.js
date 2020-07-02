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
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? DashboardWhite : DashboardBlack}
        />
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
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? CopyWhite : CopyBlack}
        />
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
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? SignalWhite : SignalBlack}
        />
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
        <img
          alt="zignaly"
          className={"icon"}
          src={storeSettings.darkStyle ? TerminalWhite : TerminlBlack}
        />
        <Typography variant="h6">
          <FormattedMessage id="menu.tradingterminal" />
        </Typography>
      </Link>
      <ThemeSwitcher full={hover} />
    </Box>
  );
};

export default Sidebar;
