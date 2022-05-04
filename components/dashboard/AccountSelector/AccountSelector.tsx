import React, { useCallback, useRef } from "react";
import ImageWithBasePath from "components/common/ImageWithBasePath";
import useUser, { AVATARS_COUNT } from "lib/hooks/useUser";
import { Typography, OptionDotsIcon, TextButton, ArrowBottomIcon } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setSelectedExchange } from "store/actions/settings";

import * as styled from "./styles";

const AccountSelector = () => {
  const intl = useIntl();
  const {
    user,
    selectedExchange: { internalName, exchangeType, internalId },
    avatar,
  } = useUser();
  const dispatch = useDispatch();

  const Accounts = useCallback(() => {
    return (
      <styled.AccountsContainer>
        {user.exchanges.map((e, i) => (
          <styled.AccountSelectButton
            selected={internalId === e.internalId}
            onClick={() => dispatch(setSelectedExchange(e.internalId))}
            key={e.internalId}
            caption={e.internalName}
            leftElement={
              <Box display="flex" alignItems="center" mr="15px">
                <ImageWithBasePath
                  src={`/images/avatars/avatar-${
                    user.exchanges.findIndex((_e) => e.internalId === _e.internalId) % AVATARS_COUNT
                  }.svg`}
                  width={26}
                  height={26}
                  layout="fixed"
                />
              </Box>
            }
          />
        ))}
      </styled.AccountsContainer>
    );
  }, [user.exchanges, internalId]);

  return (
    <styled.Layout>
      <ImageWithBasePath src={avatar} width={68} height={68} />
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
          <FormattedMessage id="dashboard.type" tagName="span" />
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
