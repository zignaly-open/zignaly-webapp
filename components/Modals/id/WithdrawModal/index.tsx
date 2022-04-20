// Dependencies
import React, { useEffect, useState } from "react";
import AssetSelect from "components/common/AssetSelect";
import NetworkSelect from "components/common/NetworkSelect";

// Styled Components
import { ModalContainer, Title, Body, Actions } from "../styles";

// Assets
import { FormattedMessage, useIntl } from "react-intl";
import { useExchangeAssets } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import { TextField } from "@mui/material";

import * as styled from "./styles";

type DepositModalTypesProps = {
  action?: any;
  initialCoin: string;
};

function WithdrawModal({ action = null, initialCoin }: DepositModalTypesProps): React.ReactElement {
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, false);
  const intl = useIntl();
  const [selectedCoin, setSelectedCoin] = useState(initialCoin);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  useEffect(() => {
    // Reset selected network on coin change
    // todo: doesn't work due to Select component controlled
    setSelectedNetwork(null);
  }, [selectedCoin]);

  return (
    <ModalContainer width={"420px"}>
      <Title>
        <FormattedMessage id="withdraw.title" />
      </Title>
      <Body>
        {assets ? (
          <>
            <styled.Desc variant="h3">
              <FormattedMessage id="withdraw.desc" />
            </styled.Desc>
            <AssetSelect
              assets={assets}
              // initialSelectedIndex={coinsOptions?.findIndex((o) => o.value === initialCoin) + 1}
              onSelectItem={(item) => setSelectedCoin(item.value)}
            />
            {selectedCoin && (
              <>
                <NetworkSelect
                  networks={assets[selectedCoin].networks}
                  onSelectItem={(item) => setSelectedNetwork(item.value)}
                />
                {selectedNetwork && (
                  <>
                    <TextField
                      fullWidth
                      multiline
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <Loader />
        )}
      </Body>
    </ModalContainer>
  );
}

export default WithdrawModal;
