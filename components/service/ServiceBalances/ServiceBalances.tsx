import React, { useContext } from "react";
import { useServiceAssets } from "lib/hooks/useAPI";
import { PriceLabel, Table, CoinLabel } from "zignaly-ui";
import Loader from "components/common/Loader/Loader";
import useUser from "lib/hooks/useUser";
import { useIntl } from "react-intl";
import { ServiceContext } from "../ServiceContext";

const ServiceBalances = () => {
  const intl = useIntl();
  const { selectedExchange } = useUser();
  const { selectedService } = useContext(ServiceContext);
  const { data: assets, error } = useServiceAssets(
    selectedExchange?.internalId,
    selectedService.id,
  );

  const columns = [
    {
      Header: intl.formatMessage({ id: "col.coin" }),
      accessor: "coin",
    },
    {
      Header: intl.formatMessage({ id: "col.coins.total" }),
      accessor: "totalBalance",
    },
    {
      Header: intl.formatMessage({ id: "col.coins.available" }),
      accessor: "availableBalance",
    },
    {
      Header: intl.formatMessage({ id: "col.coins.locked" }),
      accessor: "lockedBalance",
    },
    {
      Header: intl.formatMessage({ id: "col.totalValueBTC" }),
      accessor: "totalBTC",
    },
    {
      Header: intl.formatMessage({ id: "col.totalValueUSD" }),
      accessor: "totalUSD",
    },
  ];

  const data = assets
    ? Object.entries(assets).map(([coin, coinBalance]) => ({
        coin: <CoinLabel coin={coin} name={coinBalance.name} />,
        totalBalance: <PriceLabel coin={coin} value={coinBalance.balanceTotal} />,
        availableBalance: <PriceLabel coin={coin} value={coinBalance.balanceFree} />,
        lockedBalance: <PriceLabel coin={coin} value={coinBalance.balanceLocked} />,
        totalBTC: <PriceLabel coin="BTC" value={coinBalance.balanceTotalBTC} />,
        totalUSD: <PriceLabel coin="USD" value={coinBalance.balanceTotalUSDT} fiat />,
        action: null,
      }))
    : undefined;

  return data ? <Table columns={columns} data={data} /> : <Loader />;
};

export default ServiceBalances;
