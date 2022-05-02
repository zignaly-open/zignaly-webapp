import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import Loader from "components/Loader/Loader";
import { useUserService } from "lib/useAPI";
import useUser from "lib/useUser";
import Link from "next/link";
import React, { useContext } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { InputText, Typography, TextButton, OpenArrowIcon } from "zignaly-ui";
import { ServiceContext } from "../ServiceContext";
import * as styled from "./styles";
import { URL_SIGNALS_PARAMS, URL_SIGNALS_SEND } from "lib/constants";

const SIGNAL_URL =
  "https://zignaly.com/api/signals.php?key=YOURSECRETKEY&type=entry&exchange=zignaly&pair=ethusdt&orderType=limit&positionSize=10&signalId=123&limitPrice=3420&takeProfitPercentage1=20&takeProfitAmountPercentage1=100&stopLossPercentage=-5";

const ServiceSignals = () => {
  const { selectedService } = useContext(ServiceContext);
  const { selectedExchange } = useUser();
  const { data } = useUserService(selectedExchange.internalId, selectedService.id);
  const intl = useIntl();

  return (
    <styled.Layout>
      <Typography variant="h2">
        <FormattedMessage id="signals.trade" />
      </Typography>
      <div>
        <Typography>
          <FormattedMessage
            id="signals.desc"
            values={{
              a: (chunks) => {
                return <Link href="/signals">{chunks[0]}</Link>;
              },
            }}
          />
          <br />
          <FormattedMessage id="signals.desc2" />
        </Typography>
      </div>
      <TextButton
        caption={<FormattedMessage id="signal.help.how" />}
        rightElement={<OpenArrowIcon />}
        label={intl.formatMessage({ id: "signals.syntax" })}
        href={URL_SIGNALS_SEND}
      />
      <TextButton
        caption={<FormattedMessage id="signal.help.params" />}
        rightElement={<OpenArrowIcon />}
        label={intl.formatMessage({ id: "signals.syntax" })}
        href={URL_SIGNALS_PARAMS}
      />
      {data ? (
        <>
          <Box mt="60px" mb="48px">
            <InputText
              value={data.key}
              readOnly
              label={intl.formatMessage({ id: "signals.key" })}
            />
          </Box>
          <InputText
            value={SIGNAL_URL}
            readOnly
            multiline
            label={intl.formatMessage({ id: "signals.syntax" })}
          />
        </>
      ) : (
        <Loader />
      )}
    </styled.Layout>
  );
};

export default ServiceSignals;
