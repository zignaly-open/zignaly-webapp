import React from 'react';
import './FAQ.sass';
import { Box, Typography} from '@material-ui/core';

const FAQ = () => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className={"FAQ"}>
            <Typography variant="h4" className="title" >frequently asked questions</Typography>
            <Box className="questionContainer" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" className="question">How do i start trading?</Typography>
                <Typography variant="caption" className="question">How can i withdraw my balance?</Typography>
                <Typography variant="caption" className="question">What are signal providers?</Typography>
                <Typography variant="caption" className="question">What are copy traders?</Typography>
            </Box>
        </Box>
    )
}

export default FAQ;