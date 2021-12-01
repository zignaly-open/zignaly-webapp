import React from "react";
import styled from "styled-components";
import { useExpanded, useTable } from "react-table";
import { Typography, Tooltip } from "@material-ui/core";
import { isMobile } from "styles/styles";
import ConditionalWrapper from "components/ConditionalWrapper";

const TypographyHeader = styled(Typography)`
  color: ${({ theme }) => theme.newTheme.neutralText};
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

const Table = ({ columns, data, renderRowSubComponent, initialState = {} }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
    visibleColumns,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        // pageIndex: 0,
        ...initialState,
      },
    },
    useExpanded,
  );

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup, indexGroup) => (
          <tr key={`--group-${indexGroup.toString()}`} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, indexColumn) => (
              <th key={`--group-column-${indexColumn.toString()}`} {...column.getHeaderProps()}>
                <ConditionalWrapper
                  condition={Boolean(column.tooltip)}
                  wrapper={(_children) => <Tooltip title={column.tooltip}>{_children}</Tooltip>}
                >
                  <TypographyHeader>{column.render("Header")}</TypographyHeader>
                </ConditionalWrapper>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <>
              <tr
                {...row.getRowProps()}
                {...(renderRowSubComponent && row.getToggleRowExpandedProps({}))}
                key={`--group-column-row-${i.toString()}`}
              >
                {row.cells.map((cell, cellIndex) => {
                  return (
                    <td
                      key={`--group-column-cell-${cellIndex.toString()}`}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length} style={{ border: "none" }}>
                    {renderRowSubComponent({ row })}
                  </td>
                </tr>
              ) : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
