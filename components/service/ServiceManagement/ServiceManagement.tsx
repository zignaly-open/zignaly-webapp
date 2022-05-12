import useUser from "lib/hooks/useUser";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  Typography,
  PriceLabel,
  Button,
  SliderProgress,
  TextButton,
  EditPenIcon,
} from "zignaly-ui";
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
        <styled.MainPriceLabel value={100} coin="USDT" />
      </styled.Box>
      <styled.TopConnector />
      <styled.TopHorizontalConnection />
      <styled.BottomContainer>
        <styled.Box>
          <Typography variant="h2" color="neutral100">
            <FormattedMessage id="management.tradingFunds" />
          </Typography>
          <Typography>
            <FormattedMessage id="management.tradingFunds.desc" />
          </Typography>
          <styled.TradingFunds>
            <Typography color="neutral400" variant="body2">
              <FormattedMessage id="management.availableTrading" />
              <styled.InlinePriceLabel value={100} coin="USDT" />
            </Typography>
            <Typography color="neutral400" variant="body2">
              <FormattedMessage id="management.allocatedTrading" />
              <styled.InlinePriceLabel value={320} coin="USDT" />
            </Typography>
          </styled.TradingFunds>
          <styled.LabelHardDisc>
            <FormattedMessage id="management.hardDisconnected" />
          </styled.LabelHardDisc>
          <SliderProgress value={30} max={50} />
        </styled.Box>
        <styled.MiddleContainer>
          <styled.HorizontalConnection />
          <Button variant="secondary" caption={intl.formatMessage({ id: "management.transfer" })} />
          <styled.HorizontalConnection />
        </styled.MiddleContainer>
        <styled.Box>
          <Typography variant="h2" color="neutral100">
            <FormattedMessage id="management.disconnectionFunds" />
          </Typography>
          <Typography>
            <FormattedMessage id="management.disconnectionFunds.desc" />
          </Typography>
          <styled.TradingFunds>
            <Typography color="neutral400" variant="body2">
              <FormattedMessage id="management.availableDisconnection" />
              <styled.InlinePriceLabel value={90} coin="USDT" />
            </Typography>
            <Typography color="neutral400" variant="body2">
              <FormattedMessage id="management.neededSnapshot" />
              <styled.InlinePriceLabel value={3020} coin="USDT" />
            </Typography>
            <Typography color="neutral400" variant="body2">
              <FormattedMessage id="management.minBalance" />
              <styled.InlinePriceLabel value={100} coin="USDT" />
              <TextButton
                leftElement={<EditPenIcon />}
                caption={<FormattedMessage id="srv.edit" />}
              />
            </Typography>
            <Typography color="neutral400" variant="body2">
              <FormattedMessage id="management.heldHardDisc" />
              <Typography variant="body2">
                <FormattedMessage id="management.controlledZignaly" />
              </Typography>
            </Typography>
          </styled.TradingFunds>
        </styled.Box>
      </styled.BottomContainer>
    </styled.Layout>
  );
};

export default ServiceSignals;
