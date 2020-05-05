import React from 'react';
import style from './Header.module.sass';
import { Box } from '@material-ui/core';
import LogoWhite from '../../../images/logo/logoWhite.svg';
import LogoBlack from '../../../images/logo/logoBlack.svg';
import { useSelector } from 'react-redux';
import LanguageSwitcher from '../../LanguageSwitcher';

const Header = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)

    return (
        <Box bgcolor="background.default" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className={style.header}>
            <img src={darkStyle ? LogoWhite :LogoBlack} className={style.headerLogo} alt="zignaly-logo" />
            <LanguageSwitcher />
        </Box>
    )
}

export default Header;