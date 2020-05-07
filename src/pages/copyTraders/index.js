import React from 'react';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withLayout from "../../layout";
import withPageContext from "../../pageContext";
import Helmet from 'react-helmet';

const CopyTraders = () => {
    return (
        <React.Fragment>
            <Helmet>
                <title>Copy Traders</title>
            </Helmet>
            <Box display="flex" flexDirection="row" justifyContent="center" className="dashboard">
                <h1>I will be the Copy Traders</h1>
            </Box>
        </React.Fragment>
    )
}

export default compose(
    withPageContext,
    withLayout
)(CopyTraders);