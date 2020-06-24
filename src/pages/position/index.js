import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { compose } from "recompose";
import { Helmet } from "react-helmet";
import withDashboardLayout from "../../layouts/dashboardLayout";
import tradeApi from "../../services/tradeApiClient";
import { showErrorAlert } from "../../store/actions/ui";
import { useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { CircularProgress } from "@material-ui/core";
import { TradingView } from "../../components/TradingTerminal";
import useStoreSessionSelector from "../../hooks/useStoreSessionSelector";
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
  const { positionId } = props;
  const [positionEntity, setPositionEntity] = useState(/** @type {PositionEntity} */ (null));
  const storeSession = useStoreSessionSelector();
  const dispatch = useDispatch();
  const intl = useIntl();
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
  console.log("PositionEntity: ", positionEntity);

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: "menu.positionview",
          })}
        </title>
      </Helmet>
      <Box className="positionPage" display="flex" flexDirection="column" justifyContent="center">
        <Box
          className="positionDetail"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          {!positionEntity && <CircularProgress disableShrink />}
          {positionEntity && <TradingView positionEntity={positionEntity} />}
        </Box>
      </Box>
    </>
  );
};

export default compose(withDashboardLayout)(PositionPage);
