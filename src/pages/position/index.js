import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import withDashboardLayout from "../../layouts/dashboardLayout";
import { Helmet } from "react-helmet";
import tradeApi from "../../services/tradeApiClient";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
import { showErrorAlert } from "../../store/actions/ui";
import { useDispatch } from "react-redux";
import { TradingView } from "../../components/TradingTerminal";

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
  const { positionId } = props;
  const [positionEntity, setPositionEntity] = useState(/** @type {PositionEntity} */ (null));
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const fetchPosition = () => {
    const payload = {
      token: storeSession.tradeApi.accessToken,
      positionId,
    };

    tradeApi
      .positionGet(payload)
      .then((data) => {
        setPositionEntity(data);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
      });
  };

  useEffect(fetchPosition, []);

  return (
    <>
      <Helmet>
        <title>Position Detail</title>
      </Helmet>
      <Box className="positionPage" display="flex" flexDirection="column" justifyContent="center">
        <Box
          className="positionDetail"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <h2>Loading position: {positionId}</h2>
          {positionEntity && <TradingView positionEntity={positionEntity} />}
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(PositionPage);
