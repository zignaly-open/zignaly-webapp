import React, { useMemo } from "react";
import Header from "../components/Navigation/Header";
import Footer from "../components/Footer";
import { getDisplayName } from "../utils";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import "../styles/common.sass";
import themeData from '../services/theme';
import { useSelector } from "react-redux";

const withLayout = Component => {
    const WrapperComponent = props => {
        const darkStyle = useSelector(state => state.settings.darkStyle)
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
