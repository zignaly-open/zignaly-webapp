import React from "react";
import Table from "../../../Table";
import { FormattedMessage } from "react-intl";
import { formatFloat, FormatedDateTime } from "../../../../utils/format";

const ProfitSharingTable = () => {
  /**
   * @type {Array<MUIDataTableColumn>} Table columns
   */
  let columns = [
    {
      name: "type",
      label: "col.type",
    },
    {
      name: "amount",
      label: "col.amount",
    },
    {
      name: "date",
      label: "col.date",
      options: {
        customBodyRender: FormatedDateTime,
      },
    },
  ];

  /**
   * @type {MUIDataTableOptions}
   */
  const options = {
    sortOrder: {
      date: "timestamp",
      direction: "desc",
    },
  };

  const data = [
    {
      date: "2020-10-07",
      type: "init",
      amount: "100",
    },
    {
      date: "2020-10-08",
      type: "withdraw",
      amount: "100",
    },
  ];

  return (
    <div className="profitSharingTable">
      <Table
        columns={columns}
        data={data}
        options={options}
        // persistKey={persistKey}
        title={<FormattedMessage id="profitsharing.accounting" />}
      />
    </div>
  );
};

export default ProfitSharingTable;
