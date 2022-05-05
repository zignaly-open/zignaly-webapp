import { Box } from "@mui/system";
import Loader from "components/common/Loader/Loader";
import { useUserService } from "lib/hooks/useAPI";
import useUser from "lib/hooks/useUser";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  InputText,
  Typography,
  TextButton,
  OpenArrowIcon,
  IconButton,
  EyeClosedIcon,
  EyeOpenIcon,
} from "zignaly-ui";
import { ServiceContext } from "../ServiceContext";
import * as styled from "./styles";
import { URL_SIGNALS_PARAMS, URL_SIGNALS_SEND } from "utils/constants";
import CopyButton from "components/common/CopyButton";
import { useTheme } from "styled-components";

const SIGNAL_URL =
  "https://zignaly.com/api/signals.php?key=YOURSECRETKEY&type=entry&exchange=zignaly&pair=ethusdt&orderType=limit&positionSize=10&signalId=123&limitPrice=3420&takeProfitPercentage1=20&takeProfitAmountPercentage1=100&stopLossPercentage=-5";

const ServiceSignals = () => {
  const [showKey, setShowKey] = useState(false);
  const { selectedService } = useContext(ServiceContext);
  const { selectedExchange } = useUser();
  const { data } = useUserService(selectedExchange.internalId, selectedService.id);
  const intl = useIntl();
  const theme = useTheme();

  return (
    <styled.Layout>
      <Typography variant="h1">
        <FormattedMessage id="signals.trade" />
      </Typography>
      <div>
        <Typography color="neutral200">
          <FormattedMessage
            id="signals.desc"
            values={{
              // @ts-ignore
              a: (chunks) => <Link href="/signals">{chunks}</Link>,
            }}
          />
          <br />
          <FormattedMessage id="signals.desc2" />
        </Typography>
      </div>
      <TextButton
        caption={<FormattedMessage id="signal.help.how" />}
        href={URL_SIGNALS_SEND}
        rightElement={<OpenArrowIcon />}
      />
      <TextButton
        caption={<FormattedMessage id="signal.help.params" />}
        href={URL_SIGNALS_PARAMS}
        rightElement={<OpenArrowIcon />}
      />
      {data ? (
        <>
          <Box mb="48px" mt="60px">
            <InputText
              label={intl.formatMessage({ id: "signals.key" })}
              readOnly
              rightSideElement={
                <styled.SideButtons>
                  <IconButton
                    icon={showKey ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    onClick={() => setShowKey(!showKey)}
                    variant="flat"
                  />
                  <CopyButton content={data.key} />
                </styled.SideButtons>
              }
              type={showKey ? "text" : "password"}
              value={data.key}
            />
          </Box>
          <InputText
            label={intl.formatMessage({ id: "signals.syntax" })}
            multiline
            readOnly
            rightSideElement={
              <styled.SideButtons>
                <CopyButton content={SIGNAL_URL} />
              </styled.SideButtons>
            }
            value={SIGNAL_URL}
          />
        </>
      ) : (
        <Loader />
      )}
    </styled.Layout>
  );
};

export default ServiceSignals;
