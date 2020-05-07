import React from "react";
import "../../styles/common.sass";
import './dashboardLayout.sass';
import { getDisplayName } from "../../utils";
import { Box } from '@material-ui/core';
import FAQ from "../../components/FAQ";
import DashboardHeader from "../../components/Dashboard/DashboardHeader";

const withDashboardLayout = Component => {
    const WrapperComponent = props => {
        const exchange = false
        return (
            <Box className="dashboardLayout" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                <Box className="titleBox" display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                    <span className="pageTitle">Dashboard</span>
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
                            Go to <b>My Exchange Accounts</b> in the menu at the top-right to set up your exchange
                        </span>
                        <span className="text">
                            To be able to trade on Zignaly you need to connect or create at least one exchange accounts like <b>Binance</b> or <b>KuCoin</b>.
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