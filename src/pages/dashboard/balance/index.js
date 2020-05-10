import React from 'react';
import './balance.sass';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withAppLayout from "../../../layouts/appLayout";
import withDashboardLayout from "../../../layouts/dashboardLayout";
import withPageContext from "../../../pageContext";
import Helmet from 'react-helmet';
import TotalEquity from '../../../components/Balance/TotalEquity';
import CryptoComposition from '../../../components/Balance/CryptoComposition';
import AvailableBalance from '../../../components/Balance/AvailableBalance';

const Balance = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Balance</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" flexWrap="wrap" className="balancePage">
                <Box className="equityBox">
                    <TotalEquity />
                </Box>
                <Box className="cryptoBox">
                    <CryptoComposition />
                </Box>
                <Box className="balanceBox">
                    <AvailableBalance />
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withAppLayout,
    withDashboardLayout
)(Balance);