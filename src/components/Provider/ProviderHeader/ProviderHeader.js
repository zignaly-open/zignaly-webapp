import React, { useContext, useEffect, useState } from "react";
import "./ProviderHeader.scss";
import { Box } from "@material-ui/core";
import SubNavHeader from "../../SubNavHeader";
import {
  createProviderRoutes,
  createTraderRoutes,
  createProfitSharingRoutes,
} from "../../../utils/routesMapping";
import useStoreViewsSelector from "../../../hooks/useStoreViewsSelector";
import TraderHeaderActions from "./TraderHeaderActions";
import TraderHeaderInfo from "./TraderHeaderInfo";
import useSelectedExchange from "hooks/useSelectedExchange";
import ProviderContext from "../../../context/ProviderContext";
import { FormattedMessage } from "react-intl";
import { ConfirmDialog } from "components/Dialogs";
import { navigate } from "gatsby";

/**
 * @typedef {import('../../../utils/routesMapping').NavigationLink} NavigationLink
 */

/**
 * Provides the navigation bar for the opened provider.
 *
 * @returns {JSX.Element} Component JSX.
 */
const ProviderHeader = () => {
  const { provider } = useStoreViewsSelector();
  const selectedExchange = useSelectedExchange();
  const providerId = typeof window !== "undefined" ? location.pathname.split("/")[2] : "";
  const [links, setLinks] = useState(/** @type {Array<NavigationLink>} */ ([]));
  const { hasAllocated } = useContext(ProviderContext);
  const [confirmConfig, setConfirmConfig] = useState({
    titleTranslationId: "",
    messageTranslationId: "",
    visible: false,
  });

  useEffect(() => {
    const routes = provider.isCopyTrading
      ? !provider.profitSharing
        ? createTraderRoutes(providerId, provider)
        : createProfitSharingRoutes(providerId, provider)
      : createProviderRoutes(providerId, provider, selectedExchange);
    if (!provider.isCopyTrading) {
      routes.links.forEach((item) => {
        if (item.to.includes("settings") && !hasAllocated) {
          item.tooltip = <FormattedMessage id="srv.settings.tooltip" />;
        }
      });
    }
    setLinks(routes ? routes.links : []);
  }, [provider, selectedExchange.internalId, hasAllocated]);

  useEffect(() => {
    if (provider.profitSharing && !provider.maxDrawdown && provider.isAdmin) {
      setConfirmConfig({
        visible: true,
        titleTranslationId: "copyt.profitsharing.maxDrawdown.modal.title",
        messageTranslationId: "copyt.profitsharing.maxDrawdown.modal",
      });
    }
  }, []);

  const handleMaxDrawdown = () => {
    const editLink = links.find((l) => l.id === "srv.edit");
    if (editLink) {
      navigate(editLink.to);
    }
  };

  const checkAccess = () => {
    // Reset focus: https://github.com/ReactTraining/react-router/issues/5210
    window.scrollTo(0, 0);
  };
  useEffect(checkAccess, []);

  return (
    <Box
      className="providerHeader"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
    >
      <ConfirmDialog
        confirmConfig={confirmConfig}
        executeActionCallback={handleMaxDrawdown}
        setConfirmConfig={setConfirmConfig}
      />
      <TraderHeaderActions provider={provider} />
      <TraderHeaderInfo provider={provider} />
      <SubNavHeader links={links} />
    </Box>
  );
};

export default ProviderHeader;
