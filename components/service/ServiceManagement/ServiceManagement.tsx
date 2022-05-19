import useUser from "lib/hooks/useUser";
import { openModal } from "lib/store/actions/ui";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useDispatch } from "react-redux";
import {
  Typography,
  PriceLabel,
  Button,
  SliderProgress,
  TextButton,
  EditPenIcon,
  Toaster,
} from "zignaly-ui";
import { ServiceContext } from "../ServiceContext";
import MinBalanceModal from "./MinBalanceModal";
import * as styled from "./styles";

const ServiceManagement = () => {
  const [showKey, setShowKey] = useState(false);
  const { selectedService } = useContext(ServiceContext);
  const { selectedExchange } = useUser();
  const intl = useIntl();
  const [editMinBalance, showEditMinBalance] = useState(false);
  const dispatch = useDispatch();

  return (
    <styled.Layout>
      {/* <Toaster
        variant="success"
        caption={intl.formatMessage({ id: "management.transfer.success" })}
      /> */}
      {/* <Toaster
        variant="error"
        caption={intl.formatMessage(
          { id: "management.hardDiconnectWarning" },
          { perc: 40, maxPerc: 50 },
        )}
      /> */}
      <MinBalanceModal
        initialValue={100}
        open={editMinBalance}
        onClose={() => showEditMinBalance(false)}
      />
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
          <Button
            variant="secondary"
            caption={intl.formatMessage({ id: "management.transfer" })}
            onClick={() => {
              dispatch(openModal("TRANSFER_MODAL"));
            }}
          />
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
                onClick={() => showEditMinBalance(true)}
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

export default ServiceManagement;
