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
  const darkStyle = useSelector((state) => state.settings.darkStyle);
  const dispatch = useDispatch();

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="grid.main"
      className="mobileAppbar"
    >
      <Link
        to={"/dashboard/positions"}
        partiallyActive={true}
        className={"sideBarLink"}
        activeClassName={"active"}
      >
        <img src={darkStyle ? DashboardWhite : DashboardBlack} alt="zignaly" className={"icon"} />
      </Link>
      <Link
        to={"/copyTraders/browse"}
        partiallyActive={true}
        className={"sideBarLink"}
        activeClassName={"active"}
      >
        <img src={darkStyle ? CopyWhite : CopyBlack} alt="zignaly" className={"icon"} />
      </Link>
      <Link
        to={"/signalProviders/browse"}
        partiallyActive={true}
        className={"sideBarLink"}
        activeClassName={"active"}
      >
        <img src={darkStyle ? SignalWhite : SignalBlack} alt="zignaly" className={"icon"} />
      </Link>
      <Link
        to={"/tradingTerminal"}
        partiallyActive={true}
        className={"sideBarLink"}
        activeClassName={"active"}
      >
        <img src={darkStyle ? TerminalWhite : TerminlBlack} alt="zignaly" className={"icon"} />
      </Link>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        className={darkStyle ? "checkedDarkBox" : "checkedLightBox"}
      >
        <img
          onClick={() => dispatch(selectDarkTheme(!darkStyle))}
          src={darkStyle ? OutlineWhite : FillWhite}
          alt="zignaly"
          className={"icon"}
        />
      </Box>
    </Box>
  );
};

export default MobileAppbar;
