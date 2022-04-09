import Image from "next/image";
import useUser from "lib/useUser";
import * as styled from "./styles";
import { Typography } from "zignaly-ui";
import useSelectedExchange from "../../../src/hooks/useSelectedExchange";
import { FormattedMessage, useIntl } from "react-intl";

const AccountSelector = () => {
  const intl = useIntl();
  const {
    user,
    selectedExchange: { internalName, exchangeType },
  } = useUser();
  console.log(internalName);

  return (
    <styled.Layout>
      <Image src="/avatar.svg" width={68} height={68} />
      <styled.InfoBox>
        <Typography variant="h1">{internalName}</Typography>
        <styled.TypographyType>
          <FormattedMessage id="dashboard.type" />
          <FormattedMessage
            id={exchangeType === "futures" ? "exchange.type.futures" : "exchange.type.spot"}
          />
        </styled.TypographyType>
      </styled.InfoBox>
    </styled.Layout>
  );
};

export default AccountSelector;
