import React from 'react';
import './balance.sass';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from 'react-helmet';

const Balance = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard/Balance</title>
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
)(Balance);