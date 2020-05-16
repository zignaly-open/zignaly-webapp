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
  const darkStyle = useSelector(state => state.settings.darkStyle);
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();

  return (
    <ClickAwayListener onClickAway={() => setHover(false)}>
      <Box
        onMouseEnter={() => setHover(true)}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        bgcolor="grid.main"
        className={"sidebar " + (hover ? "full" : "")}
      >
        <Link
          to={"/dashboard/positions"}
          partiallyActive={true}
          className={"sideBarLink"}
          activeClassName={"active"}
        >
          <img src={darkStyle ? DashboardWhite : DashboardBlack} alt="zignaly" className={"icon"} />
          <Typography variant="h6">dashboard</Typography>
        </Link>
        <Link
          to={"/copyTraders/browse"}
          partiallyActive={true}
          className={"sideBarLink"}
          activeClassName={"active"}
        >
          <img src={darkStyle ? CopyWhite : CopyBlack} alt="zignaly" className={"icon"} />
          <Typography variant="h6">copy traders</Typography>
        </Link>
        <Link
          to={"/signalProviders/browse"}
          partiallyActive={true}
          className={"sideBarLink"}
          activeClassName={"active"}
        >
          <img src={darkStyle ? SignalWhite : SignalBlack} alt="zignaly" className={"icon"} />
          <Typography variant="h6">signal providers</Typography>
        </Link>
        <Link
          to={"/tradingTerminal"}
          partiallyActive={true}
          className={"sideBarLink"}
          activeClassName={"active"}
        >
          <img src={darkStyle ? TerminalWhite : TerminlBlack} alt="zignaly" className={"icon"} />
          <Typography variant="h6">trading terminal</Typography>
        </Link>
        <Box className={"themeBox"} display="flex" flexWrap="nowrap" flexDirection="row">
          {hover && (
            <React.Fragment>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                className={darkStyle ? "checkedDarkBox" : "darkBox"}
              >
                <img
                  onClick={() => dispatch(selectDarkTheme(true))}
                  src={darkStyle ? OutlineWhite : OutlineBlack}
                  alt="zignaly"
                  className={"icon"}
                />
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                className={!darkStyle ? "checkedLightBox" : "lightBox"}
              >
                <img
                  onClick={() => dispatch(selectDarkTheme(false))}
                  src={FillWhite}
                  alt="zignaly"
                  className={"icon"}
                />
              </Box>
            </React.Fragment>
          )}
          {!hover && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              className={darkStyle ? "checkedDarkBox" : "checkedLightBox"}
            >
              <img
                onClick={() => dispatch(selectDarkTheme(true))}
                src={darkStyle ? OutlineWhite : FillWhite}
                alt="zignaly"
                className={"icon"}
              />
            </Box>
          )}
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default Sidebar;
