import React, { useState } from "react";
import "./MobileAppbar.scss";
import { Box, Slide } from "@material-ui/core";
import Link from "../../LocalizedLink";
import { useSelector, useDispatch } from "react-redux";
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

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 */

const MobileAppbar = () => {
  const [menu, showMenu] = useState(false);
  /**
   * Settings darkStyle selector.
   *
   * @param {DefaultState} state Redux store state data.
   * @return {boolean} Flag that indicates if darkStyle is enabled.
   */
  const selector = (state) => state.settings.darkStyle;
  const darkStyle = useSelector(selector);
  const dispatch = useDispatch();

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
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/dashboard/positions"}
      >
        <img alt="zignaly" className={"icon"} src={darkStyle ? DashboardWhite : DashboardBlack} />
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/copyTraders/browse"}
      >
        <img alt="zignaly" className={"icon"} src={darkStyle ? CopyWhite : CopyBlack} />
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/signalProviders/browse"}
      >
        <img alt="zignaly" className={"icon"} src={darkStyle ? SignalWhite : SignalBlack} />
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/tradingTerminal"}
      >
        <img alt="zignaly" className={"icon"} src={darkStyle ? TerminalWhite : TerminlBlack} />
      </Link>
      <Box
        className="sideBarLink"
        display="flex"
        flexDirection="row"
        justifyContent="center"
        onClick={() => showMenu(!menu)}
      >
        {!menu && (
          <img alt="zignaly" className={"icon"} src={darkStyle ? PersonWhite : PersonBlack} />
        )}
        {menu && <img alt="zignaly" className={"icon"} src={darkStyle ? CloseWhite : CloseBlack} />}
      </Box>
      <Box
        className={darkStyle ? "checkedDarkBox" : "checkedLightBox"}
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <img
          alt="zignaly"
          className={"icon"}
          onClick={() => dispatch(selectDarkTheme(!darkStyle))}
          src={darkStyle ? OutlineWhite : FillWhite}
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
