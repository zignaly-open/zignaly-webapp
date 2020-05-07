import React from 'react';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withLayout from "../../layout";
import withPageContext from "../../pageContext";
import Helmet from 'react-helmet';

const TradingTerminal = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Trading Terminal</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" className="dashboard">
                <h1>I will be the Trading Terminal</h1>
            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withLayout
)(TradingTerminal);