import React, { useCallback, useRef } from "react";
import ImageWithBasePath from "components/common/ImageWithBasePath";
import useUser from "lib/hooks/useUser";
import { Typography, OptionDotsIcon, TextButton, ArrowBottomIcon } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setSelectedExchange } from "src/store/actions/settings";

import * as styled from "./styles";

const AccountSelector = () => {
  const intl = useIntl();
  const {
    user,
    selectedExchange: { internalName, exchangeType, internalId },
  } = useUser();
  const dispatch = useDispatch();

  const handleExchangeAccountChange = (e) => {
    dispatch(setSelectedExchange(e.value));
  };

  const Accounts = useCallback(() => {
    return (
      <styled.AccountsContainer>
        {user.exchanges.map((e) => (
          <styled.AccountSelectButton
            selected={internalId === e.internalId}
            onClick={() => dispatch(setSelectedExchange(e.internalId))}
            key={e.internalId}
            caption={e.internalName}
            leftElement={
              <Box display="flex" alignItems="center" mr="15px">
                <ImageWithBasePath src="/images/avatar.svg" width={26} height={26} layout="fixed" />
              </Box>
            }
          />
        ))}
      </styled.AccountsContainer>
    );
  }, [user.exchanges, internalId]);

  return (
    <styled.Layout>
      <ImageWithBasePath src="/images/avatar.svg" width={68} height={68} />
      <styled.InfoBox>
        <Box display="flex">
          <Typography variant="h1">{internalName}</Typography>
          <styled.Selector
            icon={<ArrowBottomIcon />}
            variant="flat"
            renderDropDown={<Accounts />}
            dropDownOptions={{
              alignment: "right",
              position: "static",
            }}
          />
        </Box>
        <styled.TypographyType>
          <FormattedMessage id="dashboard.type" />
          &nbsp;
          <FormattedMessage
            id={exchangeType === "futures" ? "exchange.type.futures" : "exchange.type.spot"}
          />
        </styled.TypographyType>
      </styled.InfoBox>
    </styled.Layout>
  );
};

export default AccountSelector;
