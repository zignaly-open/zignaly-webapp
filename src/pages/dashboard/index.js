import React from 'react';
import './dashboard.sass';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withLayout from "../../layout";
import withPageContext from "../../pageContext";
import Helmet from 'react-helmet';

const Dashboard = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" className="dashboard">
                <Box className="titleBox" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="flex-end">
                    <span className="pageTitle">Dashboard</span>
                    <span className="exchangeTitle">KuCion (Demo)</span>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withLayout
)(Dashboard);