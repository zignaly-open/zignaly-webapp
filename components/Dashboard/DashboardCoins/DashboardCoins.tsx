import React from "react";
import { useIntl } from "react-intl";
import { Table, Button, ButtonGroup, PriceLabel, CoinLabel } from "zignaly-ui";
import { useExchangeAssets } from "lib/useAPI";
import useUser from "lib/useUser";
import Loader from "components/Loader/Loader";
import { useDispatch } from "react-redux";
import { openModal } from "src/store/actions/ui";
import { ModalTypesId } from "typings/modal";

const DashboardCoins = () => {
  const intl = useIntl();
  const { selectedExchange } = useUser();
  const { data: assets, error } = useExchangeAssets(selectedExchange?.internalId, true);
  const dispatch = useDispatch();

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
    ? Object.entries(assets)
        // todo: remove once sorting fixed
        .sort((a, b) => parseFloat(b[1].balanceTotalUSDT) - parseFloat(a[1].balanceTotalUSDT))
        .map(([coin, coinBalance]) => ({
          coin: <CoinLabel coin={coin} name={coinBalance.name} />,
          totalBalance: <PriceLabel coin={coin} value={coinBalance.balanceTotal} />,
          availableBalance: <PriceLabel coin={coin} value={coinBalance.balanceFree} />,
          lockedBalance: <PriceLabel coin={coin} value={coinBalance.balanceLocked} />,
          totalBTC: <PriceLabel coin="BTC" value={coinBalance.balanceTotalBTC} />,
          totalUSD: <PriceLabel coin={"USD"} value={coinBalance.balanceTotalUSDT} fiat />,
          action: (
            <ButtonGroup>
              <Button
                variant="secondary"
                caption={intl.formatMessage({ id: "action.deposit" })}
                onClick={() =>
                  dispatch(
                    openModal(ModalTypesId.DEPOSIT_MODAL, {
                      initialCoin: coin,
                    }),
                  )
                }
              />
              <Button
                variant="secondary"
                caption={intl.formatMessage({ id: "action.withdraw" })}
                onClick={() =>
                  dispatch(
                    openModal(ModalTypesId.WITHDRAW_MODAL, {
                      initialCoin: coin,
                    }),
                  )
                }
              />
            </ButtonGroup>
          ),
        }))
    : undefined;

  return data ? <Table columns={columns} data={data} /> : <Loader />;
};

export default DashboardCoins;
