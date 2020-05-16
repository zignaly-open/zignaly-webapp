import React, {useState} from 'react';
import './History.scss';
import { Box, Popover, Typography } from '@material-ui/core';
import SettingsIcon from '../../../images/dashboard/settings.svg';
import FiltersUnchecked from '../../../images/dashboard/filtersHollow.svg';
import FilstersChecked from '../../../images/dashboard/filtersFill.svg';
import PositionsTable from '../../Dashboard/PositionsTable';
import PositionFilters from '../../Dashboard/PositionFilters';

const History = (props) => {
    const [settingsAnchor, setSettingAnchor] = useState(undefined)
    const [filters, showFilters] = useState(false)

    return (
        <Box bgcolor="grid.content" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start" className="history">
            <Box className="historyHeader" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" className="boxTitle">History</Typography>
                <Box className="settings" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                    <img onClick={() => showFilters(!filters)} src={filters ? FilstersChecked : FiltersUnchecked} alt="zignaly" className="icon" />
                    <img onClick={(e) => setSettingAnchor(e.currentTarget)} src={SettingsIcon} alt="zignaly" className="icon" />
                </Box>
            </Box>
            {filters &&
                <PositionFilters onClose={() => showFilters(false)} />
            }
            <PositionsTable />
            <Popover
                open={Boolean(settingsAnchor)}
                onClose={() => setSettingAnchor(undefined)}
                anchorEl={settingsAnchor}
                anchorOrigin={{vertical: 'top',horizontal: 'left',}}
                transformOrigin={{vertical: 'top',horizontal: 'right',}}>

            </Popover>
        </Box>
    )
}

export default History;