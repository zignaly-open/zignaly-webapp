import React, { useState } from 'react';
import style from './Sidebar.module.sass';
import { Box } from '@material-ui/core';
import Link from '../../LocalizedLink';
import { useSelector } from 'react-redux';
import SignalWhite from '../../../images/sidebar/signalWhite.svg';
import SignalBlack from '../../../images/sidebar/signalBlack.svg';
import TerminalWhite from '../../../images/sidebar/terminalWhite.svg';
import TerminlBlack from '../../../images/sidebar/terminalBlack.svg';
import CopyWhite from '../../../images/sidebar/copyWhite.svg';
import CopyBlack from '../../../images/sidebar/copyBlack.svg';
import FillWhite from '../../../images/sidebar/fillWhite.svg';
import FillBlack from '../../../images/sidebar/fillBlack.svg';
import OutlineWhite from '../../../images/sidebar/outlineWhite.svg';
import OutlineBlack from '../../../images/sidebar/outlineBlack.svg';
import DashboardWhite from '../../../images/sidebar/dashboardWhite.svg';
import DashboarBlack from '../../../images/sidebar/dashboardBlack.svg';


const Sidebar = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)
    const [hover, setHover] = useState(false)

    return (
        <Box
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            bgcolor="grid.main"
            className={style.sidebar}>

            <Link to={"/dashboard"} className={style.sideBarLink} activeClassName={style.active}>
                <img src={darkStyle ? DashboardWhite : DashboarBlack} alt="zignaly" className={style.icon} />
                <span className={style.text}>dashboard</span>
            </Link>
            <Link to={"/copyTraders"} className={style.sideBarLink} activeClassName={style.active}>
                <img src={darkStyle ? CopyWhite : CopyBlack} alt="zignaly" className={style.icon} />
                <span className={style.text}>copy traders</span>
            </Link>
            <Link to={"/signalProviders"} className={style.sideBarLink} activeClassName={style.active}>
                <img src={darkStyle ? SignalWhite : SignalBlack} alt="zignaly" className={style.icon} />
                <span className={style.text}>signal providers</span>
            </Link>
            <Link to={"/tradingTerminal"} className={style.sideBarLink} activeClassName={style.active}>
                <img src={darkStyle ? TerminalWhite : TerminlBlack} alt="zignaly" className={style.icon} />
                <span className={style.text}>trading terminal</span>
            </Link>
            <Box>

            </Box>
        </Box>
    )
}

export default Sidebar;