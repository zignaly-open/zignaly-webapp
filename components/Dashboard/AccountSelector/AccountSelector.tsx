import Image from "next/image";
import useUser from "../../../lib/useUser";
import * as styled from "./styles";
import { Typography } from "zignaly-ui";
import useSelectedExchange from "../../../src/hooks/useSelectedExchange";
import { FormattedMessage, useIntl } from "react-intl";

const AccountSelector = () => {
  const intl = useIntl();
  const { user, selectedExchange } = useUser();
  console.log(user, selectedExchange);

  return (
    <styled.Layout>
      <Image src="/avatar.svg" width={68} height={68} />
      <styled.InfoBox>
        <Typography variant="h1">{selectedExchange?.internalName}</Typography>
        <styled.Type>
          <FormattedMessage id="dashboard.type" />
          Spot
        </styled.Type>
      </styled.InfoBox>
    </styled.Layout>
  );
};

export default AccountSelector;
