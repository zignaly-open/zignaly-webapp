import React, { useState } from 'react';
import './PositionsTabs.sass';
import { Box, Tab, Tabs } from '@material-ui/core';
import SettingsIcon from '../../../images/dashboard/settings.svg';
import BorderIcon from '../../../images/dashboard/border.svg';
import Modal from '../../Modal';
import PositionSettingsForm from '../../Forms/PositionSettingsForm';

const LoginTabs = (props) => {
    const [tabValue, setTabValue] = useState(0)
    const [settingsModal, showSettingsModal] = useState(false)

    const changeTab = (event, newValue) => {
        setTabValue(newValue)
    };

    return(
        <Box bgcolor="grid.main" className="positionsTabs">
            <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Tabs value={tabValue} onChange={changeTab} classes={{indicator: 'indicator', flexContainer: 'container'}} className="tabs-menu">
                    <Tab label="open positions" classes={{selected: 'selected'}} />
                    <Tab label="closed positions" classes={{selected: 'selected'}} />
                    <Tab label="logs" classes={{selected: 'selected'}} />
                </Tabs>
                <Box className="settings" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <img src={BorderIcon} alt="zignaly" className="icon" />
                    <img onClick={() => showSettingsModal(true)} src={SettingsIcon} alt="zignaly" className="icon" />
                </Box>
            </Box>
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
            <Modal state={settingsModal} size={"medium"} onClose={() => showSettingsModal(false)}>
                <PositionSettingsForm />
            </Modal>
        </Box>
    )
}

export default LoginTabs;