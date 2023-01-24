import React from "react";
import "./TraderHeaderActions.scss";
import { Box, Typography, Hidden } from "@material-ui/core";
import CopyTraderButton from "../CopyTraderButton";
import TrialPeriod from "./TrialPeriod";
import CloneEdit from "../CloneEdit";
import ProviderLogo from "../ProviderLogo";
import FollowProviderButton from "../FollowProviderButton";
import { FormattedMessage } from "react-intl";
import { isNumber } from "lodash";
import styled from "styled-components";
import CustomButton from "components/CustomButton";
import { Launch } from "@material-ui/icons";

const Migrated = styled(Typography)`
  color: var(--purple);
  border: 2px solid var(--purple);
  border-radius: 2px;
  padding: 5px 15px;
`;

/**
 * @typedef {Object} DefaultProps
 * @property {import('../../../../services/tradeApiClient.types').DefaultProviderGetObject} provider
 */

/**
 * Trader Header Actions compoennt for CT profile.
 *
 * @param {DefaultProps} props Default props.
 * @returns {JSX.Element} Component JSX.
 */
const TraderHeaderActions = ({ provider }) => {
  return (
    <Box
      alignItems="center"
      className="traderHeaderActions"
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      justifyContent="flex-start"
    >
      <Box
        alignItems="center"
        className="titleBox"
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <ProviderLogo
          size="40px"
          title={provider.name}
          url={provider.logoUrl}
          verified={provider.verified}
        />
        <Typography variant="h1">{provider.name}</Typography>
        {provider.isAdmin && provider.isClone && <CloneEdit provider={provider} />}
      </Box>
      {provider.isCopyTrading ? (
        <>
          {provider.migrated ? (
            <CustomButton
              className="textPurple borderPurple"
              href={`https://app.zignaly.com/profit-sharing/${provider.id}`}
              target="_blank"
            >
              <Box
                px={1}
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ gap: "8px" }}
              >
                <FormattedMessage id="srv.migrated" />
                <Launch />
              </Box>
            </CustomButton>
          ) : (
            <>
              <CopyTraderButton provider={provider} />
              {provider.liquidated ? (
                <Typography className="red" variant="h4">
                  <FormattedMessage id="srv.liquidated" />
                </Typography>
              ) : isNumber(provider.maxAllocatedBalance) &&
                provider.performance.totalBalance >= provider.maxAllocatedBalance ? (
                <Typography className="red" variant="h4">
                  <FormattedMessage id="srv.maxAllocationReached" />
                </Typography>
              ) : null}
            </>
          )}
        </>
      ) : (
        <FollowProviderButton provider={provider} />
      )}
      <Hidden xsDown>
        {!provider.profitSharing && provider.internalPaymentInfo && (
          <TrialPeriod provider={provider} />
        )}
        {/* {!provider.disable && !provider.profitSharing && provider.internalPaymentInfo && (
          <PaymentButton provider={provider} />
        )} */}
      </Hidden>
    </Box>
  );
};

export default TraderHeaderActions;
