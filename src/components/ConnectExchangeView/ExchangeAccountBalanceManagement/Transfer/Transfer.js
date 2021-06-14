import React from "react";
// import ModalPathContext from "../../ModalPathContext";
import { Box } from "@material-ui/core";
import "./Transfer.scss";
import BalanceManagement from "../BalanceManagement";
import InternalTransferForm from "components/Forms/InternalTransferForm";

const Transfer = () => {
  // const {
  //   pathParams: { selectedAccount },
  // } = useContext(ModalPathContext);

  return (
    <BalanceManagement>
      <Box className="exchangeAccountTransfer">
        <InternalTransferForm />
      </Box>
    </BalanceManagement>
  );
};

export default Transfer;
