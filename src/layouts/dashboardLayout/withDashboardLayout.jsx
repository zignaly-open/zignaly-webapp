import React from "react";
import "../../styles/common.sass";
import './dashboardLayout.sass';
import { getDisplayName } from "../../utils";
import { Box } from '@material-ui/core';
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";

const withDashboardLayout = Component => {
    const WrapperComponent = props => {
        return (
            <Box className="dashboardLayout" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box className="titleBox" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-end">
                    <span className="pageTitle">Dashboard</span>
                    <span className="exchangeTitle">KuCion (Demo)</span>
                </Box>
                <DashboardHeader />
                <Box className="pageContent">
                    <Component {...props} />
                </Box>
                <Box className="faq">
                    <FAQ />
                </Box>
            </Box>
        );
    };
    WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
    return WrapperComponent;
};

export default withDashboardLayout;