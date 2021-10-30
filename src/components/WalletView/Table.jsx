import React from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { Typography } from "@material-ui/core";
import { isMobile } from "styles/styles";

const TypographyHeader = styled(Typography)`
  color: ${({ theme }) => theme.transactionTable.headTextColor};
  font-weight: 600;
`;

export const TableLayout = styled.div`
  margin-bottom: 3rem;

  ${({ theme }) => `
    table {
      width: 100%;
      border-spacing: 0;
      // border: 1px solid #1e1c4e;
      border: 1px solid ${theme.newTheme.borderColor};
      border-radius: 16px;
      overflow: hidden;

      tbody {
        font-size: 16px;
        background-color: ${theme.newTheme.backgroundColor};
      }

      ${isMobile(`
        display: block;
        overflow-x: auto;
        white-space: nowrap;
      `)}


      thead tr th {
        text-transform: uppercase;
        font-weight: 100;
        font-size: 14px;
        padding: 22px;
        background-color: ${theme.transactionTable.headBackgroundColor};
      }

      tbody td {
        border-top: 1px solid ${theme.transactionTable.border};
      }

      th,
      td {
        margin: 0;
        padding: 16px;
      }
    }
  `}
`;

const Table = ({ columns, data }) => {
  // Table
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, indexGroup) => (
          <tr key={`--group-${indexGroup.toString()}`} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, indexColumn) => (
              <th key={`--group-column-${indexColumn.toString()}`} {...column.getHeaderProps()}>
                <TypographyHeader>{column.render("Header")}</TypographyHeader>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} key={`--group-column-row-${i.toString()}`}>
              {row.cells.map((cell, cellIndex) => {
                return (
                  <td key={`--group-column-cell-${cellIndex.toString()}`} {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
