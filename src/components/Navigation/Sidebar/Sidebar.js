import React, { useState } from "react";
import "./Sidebar.scss";
import { Box, ClickAwayListener, Typography } from "@material-ui/core";
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

const Sidebar = () => {
  const darkStyle = useSelector((state) => state.settings.darkStyle);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();

  return (
    <ClickAwayListener onClickAway={() => setHover(false)}>
      <Box
        alignItems="flex-start"
        bgcolor="grid.main"
        className={"sidebar " + (hover ? "full" : "")}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        onMouseEnter={() => setHover(true)}
      >
        <Link
          activeClassName={"active"}
          className={"sideBarLink"}
          partiallyActive={true}
          to={"/dashboard/positions"}
        >
          <img alt="zignaly" className={"icon"} src={darkStyle ? DashboardWhite : DashboardBlack} />
          <Typography variant="h6">dashboard</Typography>
        </Link>
        <Link
          activeClassName={"active"}
          className={"sideBarLink"}
          partiallyActive={true}
          to={"/copyTraders/browse"}
        >
          <img alt="zignaly" className={"icon"} src={darkStyle ? CopyWhite : CopyBlack} />
          <Typography variant="h6">copy traders</Typography>
        </Link>
        <Link
          activeClassName={"active"}
          className={"sideBarLink"}
          partiallyActive={true}
          to={"/signalProviders/browse"}
        >
          <img alt="zignaly" className={"icon"} src={darkStyle ? SignalWhite : SignalBlack} />
          <Typography variant="h6">signal providers</Typography>
        </Link>
        <Link
          activeClassName={"active"}
          className={"sideBarLink"}
          partiallyActive={true}
          to={"/tradingTerminal"}
        >
          <img alt="zignaly" className={"icon"} src={darkStyle ? TerminalWhite : TerminlBlack} />
          <Typography variant="h6">trading terminal</Typography>
        </Link>
        <Box className={"themeBox"} display="flex" flexDirection="row" flexWrap="nowrap">
          {hover && (
            <>
              <Box
                className={darkStyle ? "checkedDarkBox" : "darkBox"}
                display="flex"
                flexDirection="row"
                justifyContent="center"
              >
                <img
                  alt="zignaly"
                  className={"icon"}
                  onClick={() => dispatch(selectDarkTheme(true))}
                  src={darkStyle ? OutlineWhite : OutlineBlack}
                />
              </Box>
              <Box
                className={!darkStyle ? "checkedLightBox" : "lightBox"}
                display="flex"
                flexDirection="row"
                justifyContent="center"
              >
                <img
                  alt="zignaly"
                  className={"icon"}
                  onClick={() => dispatch(selectDarkTheme(false))}
                  src={FillWhite}
                />
              </Box>
            </>
          )}
          {!hover && (
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
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default Sidebar;
