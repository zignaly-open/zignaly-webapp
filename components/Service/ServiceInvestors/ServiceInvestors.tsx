import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  PriceLabel,
  PercentageIndicator,
  ConnectionStateLabel,
  IconButton,
  OptionsDotsIcon,
  Table,
  CheckIcon,
  CloseIcon,
} from "zignaly-ui";
import Loader from "components/Loader/Loader";
import { useServiceInvestors } from "lib/hooks/useAPI";
import { ServiceContext } from "../ServiceContext";

const ServiceInvestors = () => {
  const { selectedService } = useContext(ServiceContext);
  const { data: investors, error } = useServiceInvestors(selectedService.id);

  const columns = [
    {
      Header: "User ID",
      accessor: "userId",
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Investment",
      accessor: "investment",
    },
    {
      Header: "P & L",
      accessor: "pnl",
    },
    {
      Header: "P & L Total",
      accessor: "pnlTotal",
    },
    {
      Header: "Total Fees Paid",
      accessor: "totalFeesPaid",
    },
    {
      Header: "Success Fee",
      accessor: "successFee",
    },
    {
      Header: "Fees in ZIG",
      accessor: "feesInZig",
    },
    {
      Header: "Status",
      accessor: "status",
    },
  ];

  const data = investors?.map((u) => ({
    userId: u.userId,
    email: u.email,
    investment: <PriceLabel token={"USDT"} value={"1250"} />,
    pnl: (
      <PriceLabel token={"USDT"} value={"37.5"} bottomElement={<PercentageIndicator value={3} />} />
    ),
    pnlTotal: <PriceLabel token={"USDT"} value={"145"} />,
    totalFeesPaid: <PriceLabel token={"USDT"} value={"218"} />,
    successFee: `${u.successFee}%`,
    feesInZig: u.feesInZig ? <CheckIcon /> : <CloseIcon />,
    status: <ConnectionStateLabel stateId="connected" />,
  }));

  return data ? <Table columns={columns} data={data} /> : <Loader />;
};

export default ServiceInvestors;
