import React from 'react';
import './DashboardHeader.sass';
import { Box } from '@material-ui/core';
import Link from '../../LocalizedLink';

const DashboardHeader = () => {
    return (
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" className="dashboardHeader">
            <Link to="/dashboard/positions" className="dashboardLink" activeClassName="active">
                Positions
            </Link>
            <Link to="/dashboard/balance" className="dashboardLink" activeClassName="active">
                Balance
            </Link>
            <Link to="/dashboard/connectedTraders" className="dashboardLink" activeClassName="active">
                connected traders
            </Link>
        </Box>
    )
}

export default DashboardHeader;