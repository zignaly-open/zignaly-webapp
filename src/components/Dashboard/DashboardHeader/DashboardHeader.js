import React from 'react';
import './DashboardHeader.sass';
import { Box } from '@material-ui/core';
import Link from '../../LocalizedLink';
import {FormattedMessage} from 'react-intl';

const DashboardHeader = () => {
    return (
        <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center" className="dashboardHeader hideScroll">
            <Link to="/dashboard/positions" className="dashboardLink" activeClassName="active">
                <FormattedMessage id="dashboard.positions" />
            </Link>
            <Link to="/dashboard/balance" className="dashboardLink" activeClassName="active">
                <FormattedMessage id="dashboard.balance" />
            </Link>
            <Link to="/dashboard/connectedTraders" className="dashboardLink" activeClassName="active">
                <FormattedMessage id="dashboard.traders" />
            </Link>
        </Box>
    )
}

export default DashboardHeader;