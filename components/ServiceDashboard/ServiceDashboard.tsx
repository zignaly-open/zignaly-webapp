import { Box, Button, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useIntl } from "react-intl";
// import ServiceContracts from "./ServiceContracts";
// import ServiceOrders from "./ServiceOrders";
import ServicePositions from "./ServicePositions";
// import TabPanel from "@mui/lab/TabPanel";
import styled from "styled-components";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const StyledTabs = styled(Tabs)`
  && {
    .MuiTabs-indicator {
      background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
      border-radius: 6px;
    }

    .MuiTab-root {
      text-transform: initial;
      color: #9ca3af;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      padding-left: 0;
      padding-right: 0;
      margin: 0 16px;
      /* padding: 0 8px; */
      position: relative;
      /* color: transparent; */
      /* color: rgba(0, 0, 0, 0); */

      &:before {
        content: attr(data-text);
        /* position: absolute;
        width: 100%;
        text-align: center;
        left: 0; */
        font-weight: bold;
        visibility: hidden;
        /* color: rgba(0, 0, 0, 1); */
      }
    }

    .Mui-selected {
      color: #f3f4f6;
      /* margin: 0 11px; */
      /* transform: scale(1.1); */
      font-weight: 600;
    }
  }
`;

const ServiceDashboard = () => {
  const intl = useIntl();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      {/* <TabContext value={value}> */}
      <Box>
        <StyledTabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab
            label={intl.formatMessage({ id: "dashboard.openPositions" })}
            data-text={intl.formatMessage({ id: "dashboard.openPositions" })}
          />
          <Tab
            label={intl.formatMessage({ id: "dashboard.closedPositions" })}
            data-text={intl.formatMessage({ id: "dashboard.closedPositions" })}
          />
          <Tab
            label={intl.formatMessage({ id: "dashboard.exchangeOrders" })}
            data-text={intl.formatMessage({ id: "dashboard.exchangeOrders" })}
          />
          <Tab
            label={intl.formatMessage({ id: "accounts.contracts" })}
            data-text={intl.formatMessage({ id: "accounts.contracts" })}
          />
          <Tab
            label={intl.formatMessage({ id: "dashboard.positions.log" })}
            data-text={intl.formatMessage({ id: "dashboard.positions.log" })}
          />
        </StyledTabs>
      </Box>
      <TabPanel value={value} index={0}>
        {/* <ServicePositions /> */}
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      {/* </TabContext> */}
      {/* <ServicePositions />
      <br />
      <ServiceOrders />
      <br />
      <ServiceContracts /> */}
    </>
  );
};

export default ServiceDashboard;
