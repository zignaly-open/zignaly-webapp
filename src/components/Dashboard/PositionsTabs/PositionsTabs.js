import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import TabsMenu from "../../TabsMenu";
import { PositionsTabContent } from "./";
import "./PositionsTabs.scss";
import { navigate as navigateReach } from "@reach/router";
import { FormattedMessage } from "react-intl";

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
  const [tabValue, setTabValue] = useState(0);

  const tabsList = [
    {
      display: true,
      label: <FormattedMessage id="dashboard.positions.open" />,
    },
    {
      display: true,
      label: <FormattedMessage id="dashboard.positions.closed" />,
    },
    {
      display: isProfile ? false : true,
      label: <FormattedMessage id="dashboard.positions.log" />,
    },
  ];

  /**
   * Map tab index to positions collection type.
   *
   * @param {number} tabIndex Tab index value.
   *
   * @returns {PositionsCollectionType} Collection type.
   */
  const mapIndexToCollectionType = (tabIndex) => {
    switch (tabIndex) {
      case 1:
        return "closed";

      case 2:
        return "log";

      default:
        return "open";
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
        return 1;

      case "log":
        return 2;

      default:
        return 0;
    }
  };

  const currentHash =
    typeof window !== "undefined" && window.location.hash ? window.location.hash.substr(1) : "";

  const updateActiveTab = () => {
    setTabValue(mapCollectionTypeToIndex(currentHash));
  };
  useEffect(updateActiveTab, [currentHash]);

  /**
   * Map tab index to positions collection type.
   *
   * @returns {PositionsCollectionType} Collection type.
   */
  const mapProfileIndexToCollectionType = () => {
    switch (tabValue) {
      case 1:
        return "profileClosed";

      default:
        return "profileOpen";
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

  const selectedType = isProfile
    ? mapProfileIndexToCollectionType()
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
        <TabsMenu changeTab={changeTab} tabs={tabsList} tabValue={tabValue} />
      </Box>
      <PositionsTabContent isProfile={isProfile} type={selectedType} />
    </Box>
  );
};

export default PositionsTabs;
