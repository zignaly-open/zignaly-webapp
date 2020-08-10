import React from "react";
import { Box } from "@material-ui/core";
import { Helmet } from "react-helmet";
import { useIntl } from "react-intl";
import { TradingViewEdit } from "../../components/TradingTerminal";
import "./position.scss";

/**
 * @typedef {import("../../services/tradeApiClient.types").PositionEntity} PositionEntity
 */

/**
 * @typedef {Object} PositionPageProps
 * @property {string} positionId The position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {PositionPageProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const PositionPage = (props) => {
  const { positionId = null } = props;
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${intl.formatMessage({
            id: "menu.positionview",
          })} | ${intl.formatMessage({ id: "product" })}`}
        </title>
        <script id="tvwidget" src="https://s3.tradingview.com/tv.js" type="text/javascript" />
      </Helmet>
      <Box className="positionPage" display="flex" flexDirection="column" justifyContent="center">
        <Box
          className="positionDetail"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <TradingViewEdit positionId={positionId} />
        </Box>
      </Box>
    </>
  );
};

export default PositionPage;
