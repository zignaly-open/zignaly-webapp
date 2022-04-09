import Image from "next/image";
import useUser from "lib/useUser";
import * as styled from "./styles";
import { Select, Typography } from "zignaly-ui";
import useSelectedExchange from "../../../src/hooks/useSelectedExchange";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/system";
import dispatch from "cypress/utils/dispatch";
import { useDispatch } from "react-redux";
import { setSelectedExchange } from "src/store/actions/settings";

const AccountSelector = () => {
  const intl = useIntl();
  const {
    user,
    selectedExchange: { internalName, exchangeType },
  } = useUser();
  console.log(internalName);
  const dispatch = useDispatch();

  const exchangeAccounts = user.exchanges.map((e) => ({
    caption: e.internalName,
    value: e.internalId,
    // leftElement:
  }));

  const handleExchangeAccountChange = (e) => {
    console.log(e);
    dispatch(setSelectedExchange(e.value));
  };

  return (
    <styled.Layout>
      <Image src="/avatar.svg" width={68} height={68} />
      <styled.InfoBox>
        <Typography variant="h1">{internalName}</Typography>
        <styled.TypographyType>
          <Box>
            <FormattedMessage id="dashboard.type" />
            <Select options={exchangeAccounts} onSelectItem={handleExchangeAccountChange} />
          </Box>
          <FormattedMessage
            id={exchangeType === "futures" ? "exchange.type.futures" : "exchange.type.spot"}
          />
        </styled.TypographyType>
      </styled.InfoBox>
    </styled.Layout>
  );
};

export default AccountSelector;
