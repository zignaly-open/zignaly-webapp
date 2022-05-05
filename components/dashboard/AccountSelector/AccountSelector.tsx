import React, { useCallback, useRef } from "react";
import ImageWithBasePath from "components/common/ImageWithBasePath";
import useUser, { AVATARS_COUNT } from "lib/hooks/useUser";
import { Typography, OptionDotsIcon, TextButton, ArrowBottomIcon } from "zignaly-ui";
import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/system";
import { useDispatch } from "react-redux";
import { setSelectedExchange } from "lib/store/actions/settings";

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
            caption={e.internalName}
            key={e.internalId}
            leftElement={
              <Box alignItems="center" display="flex" mr="15px">
                <ImageWithBasePath
                  height={26}
                  layout="fixed"
                  src={`/images/avatars/avatar-${
                    user.exchanges.findIndex((_e) => e.internalId === _e.internalId) % AVATARS_COUNT
                  }.svg`}
                  width={26}
                />
              </Box>
            }
            onClick={() => dispatch(setSelectedExchange(e.internalId))}
            selected={internalId === e.internalId}
          />
        ))}
      </styled.AccountsContainer>
    );
  }, [user.exchanges, internalId]);

  return (
    <styled.Layout>
      <ImageWithBasePath height={68} src={avatar} width={68} />
      <styled.InfoBox>
        <Box display="flex">
          <Typography variant="h1">{internalName}</Typography>
          <styled.Selector
            dropDownOptions={{
              alignment: "right",
              position: "static",
            }}
            icon={<ArrowBottomIcon />}
            renderDropDown={<Accounts />}
            variant="flat"
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
