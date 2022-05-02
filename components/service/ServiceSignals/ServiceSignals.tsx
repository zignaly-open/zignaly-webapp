import { TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import Loader from "components/Loader/Loader";
import { useUserService } from "lib/useAPI";
import useUser from "lib/useUser";
import Link from "next/link";
import React, { useContext } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "zignaly-ui";
import { ServiceContext } from "../ServiceContext";
import * as styled from "./styles";
import OpenArrowIcon from "public/images/openArrow.svg";
import { URL_SIGNALS_PARAMS, URL_SIGNALS_SEND } from "lib/constants";

const SIGNAL_URL =
  "https://zignaly.com/api/signals.php?key=YOURSECRETKEY&type=entry&exchange=zignaly&pair=ethusdt&orderType=limit&positionSize=10&signalId=123&limitPrice=3420&takeProfitPercentage1=20&takeProfitAmountPercentage1=100&stopLossPercentage=-5";

const ServiceSignals = () => {
  const { selectedService } = useContext(ServiceContext);
  const { selectedExchange } = useUser();
  const { data } = useUserService(selectedExchange.internalId, selectedService.id);

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
      <Button
        target="_blank"
        href={URL_SIGNALS_SEND}
        rightElement={<OpenArrowIcon />}
        variant="text"
      >
        <FormattedMessage id="signal.help.how" />
      </Button>
      <Button target="_blank" href={URL_SIGNALS_PARAMS} endIcon={<OpenArrowIcon />} variant="text">
        <FormattedMessage id="signal.help.params" />
      </Button>
      {data ? (
        <>
          <Box mt="60px">
            <TextField
              value={data.key}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
          <TextField
            value={SIGNAL_URL}
            fullWidth
            multiline
            InputProps={{
              readOnly: true,
            }}
            style={{ marginTop: "48px" }}
          />
        </>
      ) : (
        <Loader />
      )}
    </styled.Layout>
  );
};

export default ServiceSignals;
