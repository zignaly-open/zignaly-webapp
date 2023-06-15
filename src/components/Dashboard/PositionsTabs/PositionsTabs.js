import React, { useState, useEffect, useContext } from "react";
import { Box } from "@material-ui/core";
import TabsMenu from "../../TabsMenu";
import "./PositionsTabs.scss";
import { navigate as navigateReach } from "@reach/router";
import { useIntl } from "react-intl";
import PositionsConext from "../PositionsContext";
import PositionsTable from "../PositionsTable";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} DefaultProps
 * @property {Boolean} [isProfile]
 */

/**
 * Tabs component.
 *
 * @param {DefaultProps} props Default compoennt props.
 * @returns {JSX.Element} JSX component.
 */
const PositionsTabs = ({ isProfile }) => {
  const intl = useIntl();
  const { openCount, closeCount, logCount } = useContext(PositionsConext);
  /**
   * Map tab index to positions collection type.
   *
   * @param {number} tabIndex Tab index value.
   *
   * @returns {PositionsCollectionType} Collection type.
   */
  const mapIndexToCollectionType = (tabIndex) => {
    switch (tabIndex) {
      case 0:
        return "closed";

      case 1:
        return "log";

      default:
        return "closed";
    }
  };

  /**
   * Map tab collection type to index.
   *
   * @param {string} collectionType Positions collection type.
   *
   * @returns {number} Tab index.
   */
  const mapCollectionTypeToIndex = (collectionType) => {
    switch (collectionType) {
      case "closed":
        return 0;

      case "log":
        return 1;

      default:
        return 0;
    }
  };

  const currentHash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash.substr(1) : "";

  const [tabValue, setTabValue] = useState(mapCollectionTypeToIndex(currentHash));
  const updateActiveTab = () => {
    const newTabValue = mapCollectionTypeToIndex(currentHash);
    if (tabValue !== newTabValue) {
      setTabValue(newTabValue);
    }
  };
  useEffect(updateActiveTab, [currentHash]);

  /**
   * Map tab index to positions collection type.
   *
   * @param {number} value Active tab.
   * @returns {PositionsCollectionType} Collection type.
   */
  const mapProfileIndexToCollectionType = (value) => {
    switch (value) {
      default:
        return "profileClosed";
    }
  };

  /**
   * Event handler to change tab value.
   *
   * @param {React.ChangeEvent<{checked: boolean}>} event Tab index to set active.
   * @param {Number} val Tab index to set active.
   * @returns {void}
   */
  const changeTab = (event, val) => {
    setTabValue(val);
    const newTabKey = mapIndexToCollectionType(val);
    navigateReach(`#${newTabKey}`);
  };

  const tabsList = [
    {
      display: true,
      label: `${intl.formatMessage({ id: "dashboard.positions.closed" })} ${
        tabValue === 1 ? `(${closeCount}/24h)` : ""
      }`,
    },
    {
      display: !isProfile,
      label: `${intl.formatMessage({ id: "dashboard.positions.log" })} ${
        tabValue === 2 ? `(${logCount})` : ""
      }`,
    },
  ];

  const selectedType = isProfile
    ? mapProfileIndexToCollectionType(tabValue)
    : mapIndexToCollectionType(tabValue);

  return (
    <Box bgcolor="grid.content" className="positionsTabs">
      <Box
        alignItems="center"
        className="tabsBox"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <TabsMenu changeTab={changeTab} tabValue={tabValue} tabs={tabsList} />
      </Box>
      <Box className="tabPanel">
        <PositionsTable isProfile={isProfile} type={selectedType} />
      </Box>
    </Box>
  );
};

export default PositionsTabs;
