import React from 'react';
import style from './Header.module.sass';
import { Box } from '@material-ui/core';
import LogoWhite from '../../../images/logo/logoWhite.svg';
import LogoBlack from '../../../images/logo/logoBlack.svg';
import ProfileIcon from '../../../images/profileIcon.svg';
import { useSelector } from 'react-redux';
import LanguageSwitcher from '../../LanguageSwitcher';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

const Header = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)

    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className={style.header}>
            <img src={darkStyle ? LogoWhite :LogoBlack} className={style.headerLogo} alt="zignaly-logo" />
            <Box display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center" className={style.linksContainer}>
                <Box className={style.linkBox}><LanguageSwitcher /></Box>
                <Box className={style.linkBox}><NotificationsNoneIcon className={style.icon} /></Box>
                <Box className={style.linkBox}>
                    <img src={ProfileIcon} className={style.icon} alt="zignaly-user" />
                </Box>
            </Box>
        </Box>
    )
}

export default Header;