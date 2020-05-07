import React, { useState } from 'react';
import './PositionsTabs.sass';
import { Box, Tab, Tabs } from '@material-ui/core';

const LoginTabs = (props) => {
    const [tabValue, setTabValue] = useState(0)

    const changeTab = (event, newValue) => {
        setTabValue(newValue)
    };

    return(
        <Box bgcolor="grid.main" className="positionsTabs">
            <Tabs value={tabValue} onChange={changeTab} classes={{indicator: 'indicator', flexContainer: 'container'}} className="tabs-menu">
                <Tab label="open positions" classes={{selected: 'selected'}} />
                <Tab label="closed positions" classes={{selected: 'selected'}} />
                <Tab label="logs" classes={{selected: 'selected'}} />
            </Tabs>
            {tabValue === 0 &&
                <Box className="section">

                </Box>
            }
            {tabValue === 1 &&
                <Box className="section">

                </Box>
            }
            {tabValue === 2 &&
                <Box className="section">

                </Box>
            }
        </Box>
    )
}

export default LoginTabs;