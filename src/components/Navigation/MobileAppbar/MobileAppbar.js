import React from "react";
import "./MobileAppbar.scss";
import { Box } from "@material-ui/core";
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
import OutlineBlack from "../../../images/sidebar/outlineBlack.svg";
import DashboardWhite from "../../../images/sidebar/dashboardWhite.svg";
import DashboardBlack from "../../../images/sidebar/dashboardBlack.svg";
import { selectDarkTheme } from "../../../store/actions/settings";

const MobileAppbar = () => {
  const darkStyle = useSelector(state => state.settings.darkStyle);
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
        to={"/copyTraders"}
      >
        <img alt="zignaly" className={"icon"} src={darkStyle ? CopyWhite : CopyBlack} />
      </Link>
      <Link
        activeClassName={"active"}
        className={"sideBarLink"}
        partiallyActive={true}
        to={"/signalProviders"}
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
        className={darkStyle ? "checkedDarkBox" : "checkedLightBox"}
        display="flex"
        flexDirection="row"
        justifyContent="center"
      >
        <img
          alt="zignaly"
          className={"icon"}
          onClick={() => dispatch(selectDarkTheme(true))}
          src={darkStyle ? OutlineWhite : FillWhite}
        />
      </Box>
    </Box>
  );
};

export default MobileAppbar;
