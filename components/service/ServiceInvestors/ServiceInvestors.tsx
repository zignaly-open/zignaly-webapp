import React, { useContext } from "react";
import {
  PriceLabel,
  PercentageIndicator,
  ConnectionStateLabel,
  Table,
  CheckIcon,
  CloseIcon,
  UserIcon,
  Typography,
} from "zignaly-ui";
import Loader from "components/common/Loader/Loader";
import { useServiceInvestors } from "lib/hooks/useAPI";
import { ServiceContext } from "../ServiceContext";
import { FormattedMessage, useIntl } from "react-intl";

import * as styled from "./styles";

const ServiceInvestors = () => {
  const intl = useIntl();
  const { selectedService } = useContext(ServiceContext);
  const { data: investors, error } = useServiceInvestors(selectedService.id);

  const columns = [
    {
      Header: intl.formatMessage({ id: "col.users.userid" }),
      accessor: "userId",
    },
    {
      Header: intl.formatMessage({ id: "col.users.email" }),
      accessor: "email",
    },
    {
      Header: intl.formatMessage({ id: "investors.investment" }),
      accessor: "investment",
    },
    {
      Header: intl.formatMessage({ id: "investors.pnl" }),
      accessor: "pnl",
    },
    {
      Header: intl.formatMessage({ id: "investors.pnlTotal" }),
      accessor: "pnlTotal",
    },
    {
      Header: intl.formatMessage({ id: "investors.totalFees" }),
      accessor: "totalFeesPaid",
    },
    {
      Header: intl.formatMessage({ id: "investors.successFee" }),
      accessor: "successFee",
    },
    {
      Header: intl.formatMessage({ id: "investors.feesZIG" }),
      accessor: "feesInZig",
    },
    {
      Header: intl.formatMessage({ id: "investors.investment" }),
      accessor: "status",
    },
  ];

  // const data = investors?.map((u) => ({
  //   userId: u.userId,
  //   email: u.email,
  //   investment: <PriceLabel coin={"USDT"} value={"1250"} />,
  //   pnl: (
  //     <PriceLabel coin={"USDT"} value={"37.5"} bottomElement={<PercentageIndicator value={3} />} />
  //   ),
  //   pnlTotal: <PriceLabel coin={"USDT"} value={"145"} />,
  //   totalFeesPaid: <PriceLabel coin={"USDT"} value={"218"} />,
  //   successFee: `${u.successFee}%`,
  //   feesInZig: u.feesInZig ? <CheckIcon /> : <CloseIcon />,
  //   status: <ConnectionStateLabel stateId="connected" />,
  // }));
  const data = [
    {
      userId: "5f886d29da8e9666b1684c9a",
      email: "tec**@zig**.com",
      investment: <PriceLabel coin={"USDT"} value={"1250"} />,
      pnl: (
        <PriceLabel
          bottomElement={<PercentageIndicator value={3} />}
          coin={"USDT"}
          value={"37.5"}
        />
      ),
      pnlTotal: <PriceLabel coin={"USDT"} value={"145"} />,
      totalFeesPaid: <PriceLabel coin={"USDT"} value={"218"} />,
      successFee: "10%",
      feesInZig: <CheckIcon />,
      status: <ConnectionStateLabel stateId="connected" />,
    },
  ];

  return data ? (
    <>
      <styled.InvestorsBar>
        <UserIcon />
        <Typography variant="h3">
          {data.length}&nbsp;
          <FormattedMessage id="service.investors" />
        </Typography>
      </styled.InvestorsBar>
      <Table columns={columns} data={data} />
    </>
  ) : (
    <Loader />
  );
};

export default ServiceInvestors;
