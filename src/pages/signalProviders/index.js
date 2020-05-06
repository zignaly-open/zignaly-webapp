import React from 'react';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withLayout from "../../layout";
import withPageContext from "../../pageContext";

const SignalProviders = () => {
    return (
        <Box display="flex" flexDirection="row" justifyContent="center">
            <h1>I will be the SignalProviders</h1>
        </Box>
    )
}

export default compose(
    withPageContext,
    withLayout
)(SignalProviders);