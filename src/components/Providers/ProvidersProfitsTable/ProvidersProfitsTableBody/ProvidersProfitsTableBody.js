import React from "react";
import moment from "moment";
import "./ProvidersProfitsTableBody.scss";
import { TableBody, TableRow, TableCell } from "@material-ui/core";

/**
 * @typedef {import("../../../../services/tradeApiClient.types").ProviderStats} ProviderStats
 * @typedef {import("../ProvidersProfitsTable").Column} Column
 */

/**
 * @param {string} value
 * @param {number} [digits]
 */
const parseValueToFloat = (value, digits) => {
  const valueFloat = parseFloat(value);
  return digits
    ? valueFloat.toFixed(digits)
    : valueFloat >= 1 || valueFloat <= -1
    ? valueFloat.toFixed(2)
    : valueFloat.toFixed(8);
};

/**
 * @param {string} value
 */
const parseValueToTime = (value) => {
  let duration = moment.duration(parseInt(value, 10) * 1000);
  console.log(value, duration);
  let durationStr = "";
  if (duration.asDays() >= 1) {
    durationStr = duration.asDays().toFixed(1);
    durationStr += duration.asDays() > 1 ? " days" : " day";
  } else if (duration.asHours() >> 1) {
    durationStr = duration.asHours().toFixed(1);
    durationStr += duration.asHours() > 1 ? " hours" : " hour";
  } else if (duration.asMinutes() >= 1) {
    durationStr = duration.asMinutes().toFixed(1);
    durationStr += duration.asMinutes() > 1 ? " minutes" : " minute";
  } else {
    durationStr = duration.asSeconds().toFixed(1);
    durationStr += duration.asSeconds() > 1 ? " seconds" : " second";
  }

  return durationStr;
};

const parseValue = (providerStats, column) => {
  let val = providerStats[column.name];

  if (column.parse === "int") {
    val = parseInt(val, 10);
  } else if (column.parse === "float") {
    val = parseValueToFloat(val, column.digits);
  } else if (column.parse === "time") {
    val = parseValueToTime(val);
  }

  return val;
};

/**
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ProviderStats>} stats
 * @property {Array<Column>} columns
 */

/**
 * Default component props.
 *
 * @param {DefaultProps} props
 */

const ProvidersProfitsTableBody = ({ stats, columns }) => {
  console.log(stats);

  return (
    <TableBody className="tableBody">
      {stats.map((provider) => (
        <TableRow className="row" key={provider.providerId}>
          {columns.map((column) => (
            <TableCell align="left" className="cell" key={column.id}>
              {parseValue(provider, column)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default ProvidersProfitsTableBody;
