import React from 'react';
import './connectedTraders.sass';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from 'react-helmet';

const ConnectedTraders = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Connected Traders</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" className="balancePage">

            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withAppLayout,
    withDashboardLayout
)(ConnectedTraders);