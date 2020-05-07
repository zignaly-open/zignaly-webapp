import React from 'react';
import './positions.sass';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from 'react-helmet';

const Positions = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard/Balance</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" className="positionsPage">

            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withAppLayout,
    withDashboardLayout
)(Positions);