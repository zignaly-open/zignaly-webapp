import React, { useState } from 'react';
import './Header.sass';
import { Box, Menu, MenuItem, Grow, Typography } from '@material-ui/core';
import LogoWhite from '../../../images/logo/logoWhite.svg';
import LogoBlack from '../../../images/logo/logoBlack.svg';
import ProfileIcon from '../../../images/header/profileIcon.svg';
import { useSelector } from 'react-redux';
import LanguageSwitcher from '../../LanguageSwitcher';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import CustomButton from '../../CustomButton';
import LeftIcon from '../../../images/header/chevron-left.svg';
import RightIcon from '../../../images/header/chevron-right.svg';
import Link from '../../LocalizedLink';
// import UserExchangeList from './UserExchangsList';

const Header = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)
    const [showBalance, setShowBalance] = useState(false)
    const [connected, setConnected] = useState(false)
    const [anchorEl, setAnchorEl] = useState(undefined)


    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className={"header"}>
            <Box className={"logoContainer"} display="flex" flexDirection="row" alignItems="center">
                <Link to="/dashboard/positions"><img src={darkStyle ? LogoWhite :LogoBlack} className={"headerLogo"} alt="zignaly-logo" /></Link>
                <LanguageSwitcher />
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" className={"linksContainer"}>
                <Box className="balanceContainer" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <Box className={"iconBox"} display="flex" flexDirection="column" justifyContent="center">
                        <img onClick={() => setShowBalance(!showBalance)} src={showBalance ? RightIcon : LeftIcon} className={"expandIcon"} alt="zignaly" />
                    </Box>
                    {showBalance &&
                        <Grow in={true}>
                            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                                <Box className="blaanceBox" display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="subtitle1" className="title">available balance</Typography>
                                    <Typography variant="h5" className="balance">btc 0.256</Typography>
                                </Box>
                                <Box className="blaanceBox" display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="subtitle1" className="title">invested</Typography>
                                    <Typography variant="h5" className="balance">btc 0.452</Typography>
                                </Box>
                                <Box className="blaanceBox" display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="subtitle1" className="title">p/l</Typography>
                                    <Typography variant="h5" className="balance green">btc +0.47</Typography>
                                </Box>
                            </Box>
                        </Grow>
                    }
                    {!showBalance &&
                        <Grow in={true}>
                            <Box className={"iconBox"} display="flex" flexDirection="column" justifyContent="center">
                                <Typography variant="h4">Balance</Typography>
                            </Box>
                        </Grow>
                    }
                </Box>
                {!connected && <CustomButton onClick={() => setConnected(true)} className="header-btn">Connect Account</CustomButton>}
                {connected &&
                    <UserExchangeList />
                }

                <Box className={"linkBox"}>
                    <NotificationsNoneIcon className={"icon"} />
                </Box>
                <Box className={"linkBox"}>
                    <img onClick={(e) => setAnchorEl(e.currentTarget)} src={ProfileIcon} className={"icon"} alt="zignaly-user" />
                    <Menu
                        anchorEl={anchorEl}
                        classes={{paper: "menu"}}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(undefined)}>

                        <MenuItem classes={{root: darkStyle ? "darkMenu" : "lightMenu"}} onClick={() => setAnchorEl(undefined)}>Profile</MenuItem>
                        <MenuItem classes={{root: darkStyle ? "darkMenu" : "lightMenu"}} onClick={() => setAnchorEl(undefined)}>My account</MenuItem>
                        <MenuItem classes={{root: darkStyle ? "darkMenu" : "lightMenu"}} onClick={() => setAnchorEl(undefined)}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Box>
        </Box>
    )
}

export default Header;