import React, { useEffect, useMemo, useState } from "react";
// import { Box, Typography } from "@mui/material";
// import { FormattedMessage, useIntl } from "react-intl";
// import tradeApi from "services/tradeApiClient";
// import useSelectedExchange from "hooks/useSelectedExchange";
// import { Table, IconButton, TableButton, ButtonGroup, OptionsDotsIcon } from "zignaly-ui-test2";
// import { useDispatch } from "react-redux";
// import { showErrorAlert } from "store/actions/ui";
// import styled, { css } from "styled-components";
// import CoinIcon from "components/WalletView/CoinIcon";
// import NumberFormat from "react-number-format";
// import dayjs from "dayjs";
// import { ManagementPositionsEntity } from "services/tradeApiClient.types";
// import { useAPI, useGetServicePositions } from "../../lib/useAPI";

// const Cell = styled(Box)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 600;
// `;

// const TypographyCoin = styled(Typography)`
//   font-weight: 600;
//   margin-left: 4px;
//   font-size: 12px;
//   color: #706f82;
// `;

// const ProfitPercent = styled.span`
//   color: ${(props) => (props.positive ? "#26C4C1" : "#26C4C1")};
//   font-size: 12px;
//   margin-top: 2px;
// `;

// const renderProfit = (position: ManagementPositionsEntity["position"]) => {
//   return (
//     <>
//       {position.status === 1 ? (
//         <span>
//           <FormattedMessage id="dashboard.positions.entering" />
//         </span>
//       ) : (
//         <Cell flexDirection="column">
//           <Box display="flex" alignItems="center">
//             <NumberFormat
//               value={position.profit}
//               displayType="text"
//               thousandSeparator={true}
//               decimalScale={2}
//             />
//             <TypographyCoin>{position.quote}</TypographyCoin>
//           </Box>
//           <ProfitPercent positive={Boolean(position.profitPercentage)}>
//             <NumberFormat
//               value={position.profitPercentage}
//               displayType="text"
//               thousandSeparator={true}
//               decimalScale={2}
//               suffix="%"
//             />
//           </ProfitPercent>
//         </Cell>
//       )}
//     </>
//   );
// };

const ServiceInvestors = () => {
  return <></>;
  // const selectedExchange = useSelectedExchange();
  // const dispatch = useDispatch();
  // const intl = useIntl();
  // const { data: positions, error } = useGetServicePositions("612f43288aedc6362e6f7745");
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
      accessor: "pyd",
    },
    {
      Header: "P & L Total",
      accessor: "pydTotal",
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
      pyd: (
        <PriceLabel
          token={"USDT"}
          value={"37.5"}
          bottomElement={<PercentageIndicator value={3} />}
        />
      ),
      pydTotal: <PriceLabel token={"USDT"} value={"145"} />,
      totalFeesPaid: <PriceLabel token={"USDT"} value={"218"} />,
      successFee: "10%",
      feesInZig: <img src={CheckIcon} />,
      status: <ConnectionStateLabel stateId={connectionStateTypesId.CONNECTED} />,
      action: <IconButton icon={OptionsDotsIcon} />,
    },
  ];

  // return <>{positions && <Table columns={columns} data={data} />}</>;
};

export default ServiceInvestors;
