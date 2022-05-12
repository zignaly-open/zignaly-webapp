import { Box } from "@mui/system";
import Loader from "components/common/Loader/Loader";
import { useUserService } from "lib/hooks/useAPI";
import useUser from "lib/hooks/useUser";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Typography, PriceLabel, Button } from "zignaly-ui";
import { ServiceContext } from "../ServiceContext";
import * as styled from "./styles";

const ServiceSignals = () => {
  const [showKey, setShowKey] = useState(false);
  const { selectedService } = useContext(ServiceContext);
  const { selectedExchange } = useUser();
  const intl = useIntl();

  return (
    <styled.Layout>
      <styled.Box>
        <Typography variant="h2" color="neutral100">
          <FormattedMessage id="management.totalFunds" />
        </Typography>
        <styled.Funds>
          <PriceLabel value={100} coin="USDT" />
        </styled.Funds>
      </styled.Box>
      <styled.BottomContainer>
        <styled.Box>
          <Typography variant="h2" color="neutral100">
            <FormattedMessage id="management.tradingFunds" />
          </Typography>
          <Typography>
            <FormattedMessage id="management.tradingFunds.desc" />
          </Typography>
          <Typography>
            <FormattedMessage id="management.availableTrading" />
            <PriceLabel value={100} coin="USDT" />
          </Typography>
        </styled.Box>
        <styled.MiddleContainer>
          <styled.HorizontalConnection />
          <Button variant="secondary" />
        </styled.MiddleContainer>
        <styled.Box>
          <Typography variant="h2" color="neutral100">
            <FormattedMessage id="management.disconnectionFunds" />
          </Typography>
          <Typography>
            <FormattedMessage id="management.disconnectionFunds.desc" />
          </Typography>
        </styled.Box>
      </styled.BottomContainer>
    </styled.Layout>
  );
};

export default ServiceSignals;
