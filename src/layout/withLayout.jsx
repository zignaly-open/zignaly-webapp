import React, { useMemo } from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getDisplayName } from "../utils";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import "../styles/common.sass";
import themeData from '../services/theme';

const withLayout = Component => {
    const WrapperComponent = props => {
        let darkStyle = true
        const theme = useMemo(() => createMuiTheme(themeData(darkStyle)),[darkStyle])
        return (
            <React.Fragment>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Header />
                    <Component {...props} />
                    <Footer />
                </ThemeProvider>
            </React.Fragment>
        );
    };
    WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
    return WrapperComponent;
};

export default withLayout;
