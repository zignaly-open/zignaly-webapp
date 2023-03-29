import React, { useEffect } from "react";
import { Router } from "@reach/router";
import Profile from "./profile";
import Edit from "./edit";
import Management from "./management";
import Analytics from "./providerAnalytics";
import Users from "./users";
import Positions from "./positions";
import News from "./news";
import { useDispatch } from "react-redux";
import { getProvider, unsetProvider } from "../../store/actions/views";
import { withPrefix } from "gatsby";
import ProviderLayout from "../../layouts/ProviderLayout";
import { ProviderRoute as CopyTraderRoute } from "../../components/RouteComponent/RouteComponent";
import BrowsePage from "./browse";
import useStoreViewsSelector from "../../hooks/useStoreViewsSelector";
import useSelectedExchange from "hooks/useSelectedExchange";
import { navigate } from "gatsby";

/**
 *
 * @typedef {Object} LocationObject
 * @property {String} pathname
 */

/**
 * @typedef {Object} ProviderProps
 * @property {LocationObject} location position ID dynamic route path parameter.
 */

/**
 * Position detail page component.
 *
 * @param {ProviderProps} props Component properties.
 * @returns {JSX.Element} Position page element.
 */
const ProfitSharing = (props) => {
  const { location } = props;
  const { provider } = useStoreViewsSelector();
  // On production the application is served through an /app directory, ID position is +1 level.
  const idIndex = process.env.GATSBY_BASE_PATH === "" ? 2 : 3;
  const providerId = location.pathname.split("/")[idIndex];
  const selectedExchange = useSelectedExchange();
  const dispatch = useDispatch();

  const loadProvider = () => {
    if (providerId && providerId.length === 24) {
      dispatch(unsetProvider());
      const payload = {
        providerId: providerId,
        exchangeInternalId: selectedExchange.internalId,
      };
      dispatch(getProvider(payload, true));
    }
  };

  useEffect(loadProvider, [providerId, selectedExchange.internalId]);

  if (!providerId) {
    navigate("/dashboard");
  }

  const allowAdminRoutes = provider.isAdmin && !provider.isClone;

  return (
    <ProviderLayout>
      <Router>
        <CopyTraderRoute
          component={Profile}
          default
          path={withPrefix("/profitSharing/:providerId")}
          providerId={providerId}
        />
        {allowAdminRoutes && (
          <CopyTraderRoute
            component={Edit}
            path={withPrefix("/profitSharing/:providerId/edit")}
            providerId={providerId}
          />
        )}
        {allowAdminRoutes && (
          <CopyTraderRoute
            component={Management}
            path={withPrefix("/profitSharing/:providerId/management")}
            providerId={providerId}
          />
        )}
        <CopyTraderRoute
          component={Analytics}
          path={withPrefix("/profitSharing/:providerId/analytics")}
          providerId={providerId}
        />
        {allowAdminRoutes && (
          <CopyTraderRoute
            component={Users}
            path={withPrefix("/profitSharing/:providerId/users")}
            providerId={providerId}
          />
        )}
        <CopyTraderRoute
          component={Positions}
          path={withPrefix("/profitSharing/:providerId/positions")}
          providerId={providerId}
        />
        <CopyTraderRoute
          component={News}
          path={withPrefix("/profitSharing/:providerId/feed")}
          providerId={providerId}
        />
      </Router>
    </ProviderLayout>
  );
};

export default ProfitSharing;
