import React, { useState } from "react";
import "../../styles/common.sass";
import './dashboardLayout.sass';
import { getDisplayName } from "../../utils";
import { Box, Typography } from '@material-ui/core';
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";
import {FormattedMessage, FormattedHTMLMessage} from 'react-intl';

const withDashboardLayout = Component => {
    const WrapperComponent = props => {
        const [exchange, setExchange] = useState(true)

        return (
            <Box className="dashboardLayout" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box className="titleBox" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <Typography variant="h1"><FormattedMessage id="dashboard" /></Typography>
                    {exchange && <span className="exchangeTitle">KuCion (Demo)</span>}
                </Box>
                {exchange &&
                    <React.Fragment>
                        <DashboardHeader />
                        <Box className="pageContent">
                            <Component {...props} />
                        </Box>
                        <Box className="faq">
                            <FAQ />
                        </Box>
                    </React.Fragment>
                }
                {!exchange &&
                    <Box className="noExchangeBox" display="flex" flexDirection="column" justifyContent="flex-start">
                        <span className="title">
                            <FormattedHTMLMessage id="dashboard.connectexchange.title" />
                        </span>
                        <span className="text">
                            <FormattedHTMLMessage id="dashboard.connectexchange.subtitle" />
                        </span>
                    </Box>
                }
            </Box>
        );
    };
    WrapperComponent.displayName = `Layout(${getDisplayName(Component)})`;
    return WrapperComponent;
};

export default withDashboardLayout;