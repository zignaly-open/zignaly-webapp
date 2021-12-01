import React, { useState } from "react";
import { Box } from "@material-ui/core";
import { formatFloat } from "../../../../utils/format";
import Table from "../../../Table";
import CustomButton from "components/CustomButton";
import { FormattedMessage } from "react-intl";
import Modal from "components/Modal";
import ConvertCoinForm from "components/Forms/ConvertCoinForm";
import { ExchangeAsset } from "services/tradeApiClient.types";
import useSelectedExchange from "hooks/useSelectedExchange";
import { MUIDataTableColumn } from "components/Table/Table";
import { MUIDataTableOptions } from "mui-datatables";

interface CoinData {
  coin: string;
  balance: string;
}

interface CoinsTableProps {
  title: string | React.ReactNode;
  /* Key to save display columns settings. **/
  persistKey: string;
  list: ExchangeAsset[];
}

const CoinsTable = ({ title, persistKey, list }: CoinsTableProps) => {
  const [convertCoin, setConvertCoin] = useState<CoinData>(null);
  const coinsOptions = list
    .filter((c) => parseFloat(c.balanceFree))
    .map((c) => c.coin)
    .sort((a, b) => a.localeCompare(b));
  const selectedExchange = useSelectedExchange();

  let columns: MUIDataTableColumn[] = [
    {
      name: "coin",
      label: "col.coins.coin",
    },
    {
      name: "name",
      label: "col.coins.name",
    },
    {
      name: "balanceTotal",
      label: "col.coins.total",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceFree",
      label: "col.coins.available",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceLocked",
      label: "col.coins.locked",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceTotalBTC",
      label: "col.coins.btcvalue",
      options: {
        customBodyRender: formatFloat,
      },
    },
    {
      name: "balanceTotalUSDT",
      label: "col.coins.usdtvalue",
      options: {
        customBodyRender: formatFloat,
      },
    },
  ];

  if (
    selectedExchange.exchangeName.toLowerCase() === "zignaly" &&
    selectedExchange.exchangeType === "spot" &&
    process.env.GATSBY_ENABLE_CONVERT === "true"
  ) {
    columns.push({
      name: "coin",
      label: "col.actions",
      options: {
        customBodyRender: (coin: string) => {
          const balance = list.find((c) => c.coin === coin)?.balanceFree;

          return (
            <>
              <CustomButton
                className="textPurple"
                onClick={() => setConvertCoin({ coin, balance })}
                style={{ padding: 0, minWidth: "auto" }}
                disabled={!parseFloat(balance)}
              >
                <FormattedMessage id="accounts.convert" />
              </CustomButton>
            </>
          );
        },
      },
    });
  }

  const options: MUIDataTableOptions = {
    sortOrder: {
      name: "balanceTotalBTC",
      direction: "desc",
    },
  };

  return (
    <Box className="coinsTable" display="flex" flexDirection="column" width={1}>
      {convertCoin && (
        <Modal
          onClose={() => {
            setConvertCoin(null);
          }}
          size="small"
          state={true}
        >
          <ConvertCoinForm
            bases={coinsOptions}
            base={convertCoin.coin}
            balance={convertCoin.balance}
            onClose={() => {
              setConvertCoin(null);
            }}
          />
        </Modal>
      )}
      <Table
        columns={columns}
        data={list}
        options={options}
        persistKey={persistKey}
        title={title}
      />
    </Box>
  );
};

export default CoinsTable;
