import React, { useEffect, useMemo, useState } from "react";
import { useInvestors } from "../../../lib/useAPI";
import {
  PriceLabel,
  PercentageIndicator,
  ConnectionStateLabel,
  IconButton,
  OptionsDotsIcon,
  Table,
  CheckIcon,
} from "zignaly-ui-test";

const ServiceInvestors = () => {
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

  const data = [
    {
      userId: "5f886d29da8e9666b1684c9a",
      email: "tec**@zig**.com",
      investment: <PriceLabel token={"USDT"} value={"1250"} />,
      pnl: (
        <PriceLabel
          token={"USDT"}
          value={"37.5"}
          bottomElement={<PercentageIndicator value={3} />}
        />
      ),
      pnlTotal: <PriceLabel token={"USDT"} value={"145"} />,
      totalFeesPaid: <PriceLabel token={"USDT"} value={"218"} />,
      successFee: "10%",
      feesInZig: <img src={CheckIcon} />,
      status: <ConnectionStateLabel stateId="connected" />,
      action: <IconButton icon={OptionsDotsIcon} />,
    },
  ];

  return true ? <Table columns={columns} data={data} /> : null;
};

export default ServiceInvestors;
