import React from 'react';
import './Header.sass';
import { Box } from '@material-ui/core';
import LogoWhite from '../../../images/logo/logoWhite.svg';
import LogoBlack from '../../../images/logo/logoBlack.svg';
import ProfileIcon from '../../../images/profileIcon.svg';
import { useSelector } from 'react-redux';
import LanguageSwitcher from '../../LanguageSwitcher';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import CustomButton from '../../CustomButton';


const Header = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className={"header"}>
            <img src={darkStyle ? LogoWhite :LogoBlack} className={"headerLogo"} alt="zignaly-logo" />
            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" className={"linksContainer"}>
                <CustomButton className="header-btn">Connect Account</CustomButton>
                <Box className={"linkBox"}><LanguageSwitcher /></Box>
                <Box className={"linkBox"}><NotificationsNoneIcon className={"icon"} /></Box>
                <Box className={"linkBox"}>
                    <img src={ProfileIcon} className={"icon"} alt="zignaly-user" />
                </Box>
            </Box>
        </Box>
    )
}

export default Header;