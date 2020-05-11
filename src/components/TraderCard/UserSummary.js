import React from 'react';
import { Box, Typography } from '@material-ui/core';

const UserSummary = (props) => {
    const {data} = props
    let id = "traderCard"+data

    return (
        <Box bgcolor="grid.main" display="flex" flexDirection="column" justifyContent="flex-start" className="userSummary">

        </Box>
    )
}

export default UserSummary;