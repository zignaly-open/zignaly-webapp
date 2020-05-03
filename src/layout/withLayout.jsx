import React from "react";

import Header from "../components/Header";
import Footer from "../components/Footer";

import { getDisplayName } from "../utils";

import "../styles/common.sass";

const withLayout = Component => {
    const WrapperComponent = props => {
        return (
            <React.Fragment>
                <Header />
                <Component {...props} />
                <Footer />
            </React.Fragment>
        );
    };
    WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
    return WrapperComponent;
};

export default withLayout;
