import React from "react";
import {FormattedMessage} from "react-intl";

import Link from "../LocalizedLink";
import LanguageSwitcher from "../LanguageSwitcher";
import {useSelector} from 'react-redux';
import tradeApiClient from '../../services/tradeApiClient';

import "./Header.sass";

const Header = () => {
    const languageCode = useSelector(state => state.settings.languageCode);

    return (
        <header className="Header">
            <img
                className="Logo"
                alt="Gatsby"
                src="https://www.gatsbyjs.org/monogram.svg"
                width="60"
            />
            <nav>
                <Link to="/">
                    <FormattedMessage id="home.title"/>
                </Link>
                <Link to="/page1">
                    <FormattedMessage id="page1.title"/>
                </Link>
                <Link to="/subpage/page1">
                    <FormattedMessage id="subpage.page1.title"/>
                </Link>
                <Link to="/subpage/subsubpage/page1">
                    <FormattedMessage id="subpage.subsubpage.page1.title"/>
                </Link>
                <LanguageSwitcher/>
                <p>Selected language state is: {languageCode}</p>
            </nav>
        </header>
    );
}

export default Header;
