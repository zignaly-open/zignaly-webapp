import React, { useContext, useState } from "react";
import useExchangeAssets from "../../../../hooks/useExchangeAssets";
import ModalPathContext from "../../ModalPathContext";
import Convert from "./Convert";

const ConvertWrapper = () => {
  const {
    pathParams: { selectedAccount },
  } = useContext(ModalPathContext);

  const [updatedAt, setUpdatedAt] = useState(null);
  const assets = useExchangeAssets(selectedAccount.internalId, updatedAt);

  return (
    <Convert
      assets={assets}
      loadData={() => setUpdatedAt(new Date())}
      selectedAccount={selectedAccount}
      showHeader={true}
    />
  );
};

export default ConvertWrapper;
