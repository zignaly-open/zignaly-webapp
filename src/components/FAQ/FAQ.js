import React from 'react';
import './FAQ.sass';
import { Box} from '@material-ui/core';

const FAQ = () => {
    return (
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className={"FAQ"}>
            <span className="title">frequently asked questions</span>
            <Box className="questionContainer" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <span className="question">How do i start trading?</span>
                <span className="question">How can i withdraw my balance?</span>
                <span className="question">what are signal providers?</span>
                <span className="question">what are copy traders?</span>
            </Box>
        </Box>
    )
}

export default FAQ;