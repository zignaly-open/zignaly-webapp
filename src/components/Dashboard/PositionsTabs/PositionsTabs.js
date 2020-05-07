import React, { useState } from 'react';
import './PositionsTabs.sass';
import { Box, Tab, Tabs } from '@material-ui/core';
import SettingsIcon from '../../../images/dashboard/settings.svg';
import BorderIcon from '../../../images/dashboard/border.svg';

const LoginTabs = (props) => {
    const [tabValue, setTabValue] = useState(0)

    const changeTab = (event, newValue) => {
        setTabValue(newValue)
    };

    return(
        <Box bgcolor="grid.main" className="positionsTabs">
            <Tabs value={tabValue} onChange={changeTab} classes={{indicator: 'indicator', flexContainer: 'container'}} className="tabs-menu">
                <Box>
                    <Tab label="open positions" classes={{selected: 'selected'}} />
                    <Tab label="closed positions" classes={{selected: 'selected'}} />
                    <Tab label="logs" classes={{selected: 'selected'}} />
                </Box>
                <Box className="settings" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <img src={BorderIcon} alt="zignaly" className="icon" />
                    <img src={SettingsIcon} alt="zignaly" className="icon" />
                </Box>
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