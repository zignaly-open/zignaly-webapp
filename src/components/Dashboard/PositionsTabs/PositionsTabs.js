import React, { useState } from 'react';
import './PositionsTabs.sass';
import { Box, Tab, Tabs, Grow} from '@material-ui/core';
import SettingsIcon from '../../../images/dashboard/settings.svg';
import FiltersUnchecked from '../../../images/dashboard/filtersHollow.svg';
import FilstersChecked from '../../../images/dashboard/filtersFill.svg';
import Modal from '../../Modal';
import PositionSettingsForm from '../../Forms/PositionSettingsForm';
import PositionsTable from '../PositionsTable';
import PositionFilters from '../PositionFilters';

const PositionsTabs = (props) => {
    const [tabValue, setTabValue] = useState(0)
    const [settingsModal, showSettingsModal] = useState(false)
    const [filters, showFilters] = useState(false)

    const changeTab = (event, newValue) => {
        setTabValue(newValue)
    };

    return(
        <Box bgcolor="grid.content" className="positionsTabs">
            <Box className="tabsBox" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Tabs value={tabValue} onChange={changeTab} classes={{indicator: 'indicator', flexContainer: 'container'}} className="tabs-menu">
                    <Tab label="open positions" classes={{selected: 'selected'}} />
                    <Tab label="closed positions" classes={{selected: 'selected'}} />
                    <Tab label="logs" classes={{selected: 'selected'}} />
                </Tabs>
                <Box className="settings" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <img onClick={() => showFilters(!filters)} src={filters ? FilstersChecked : FiltersUnchecked} alt="zignaly" className="icon" />
                    <img onClick={() => showSettingsModal(true)} src={SettingsIcon} alt="zignaly" className="icon" />
                </Box>
            </Box>
            {filters &&
                <Grow in={filters}>
                    <Box><PositionFilters onClose={() => showFilters(false)} /></Box>
                </Grow>
            }
            {tabValue === 0 &&
                <Box className="section">
                    <PositionsTable />
                </Box>
            }
            {tabValue === 1 &&
                <Box className="section">
                    <PositionsTable />
                </Box>
            }
            {tabValue === 2 &&
                <Box className="section">
                    <PositionsTable />
                </Box>
            }
            <Modal state={settingsModal} size={"medium"} onClose={() => showSettingsModal(false)}>
                <PositionSettingsForm />
            </Modal>
        </Box>
    )
}

export default PositionsTabs;