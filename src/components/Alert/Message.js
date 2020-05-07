import React from 'react';
import './Alert.sass';
import { Box } from '@material-ui/core';

const Popup = (props) => {
    return (
        <Box bgcolor="grid.main" className="alertMessage">
            <Box className="head">
                <span>I will be alert the title</span>
            </Box>
            <Box className="body">
                <span>I will be body</span>
                <span>I will be body</span>
                <span>I will be body</span>
            </Box>
        </Box>
    )
}

export default Popup;