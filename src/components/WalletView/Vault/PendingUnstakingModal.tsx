import { Box, Typography } from "@material-ui/core";
import CustomModal from "components/Modal";
import React, { useMemo, useState } from "react";
import { Title, Modal, TextDesc } from "styles/styles";
import PiggyIcon from "images/wallet/piggy.svg";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "components/Button";
import NumberFormat from "react-number-format";
import { formatDateTimeUTC } from "utils/format";
import styled from "styled-components";
import Table, { TableLayout } from "../Table";

const Value = styled(Typography)`
  font-weight: 600;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
`;

const Coin = styled.span`
  color: #65647e;
  font-size: 11px;
  margin: 0 5px 0 4px;
`;

const StyledTextDesc = styled(TextDesc)`
  margin-bottom: 48px;
`;

interface PendingUnstakingModalProps {
  onClose: () => void;
  onCancel: () => void;
  open: boolean;
  program: VaultOffer;
  coin: WalletCoin;
}

const PendingUnstakingModal = ({
  onClose,
  onCancel,
  program,
  open,
  coin,
}: PendingUnstakingModalProps) => {
  const intl = useIntl();

  const columns = useMemo(
    () => [
      {
        Header: intl.formatMessage({ id: "transfer.internal.amount" }),
        accessor: "amount",
      },
      {
        Header: intl.formatMessage({ id: "vault.unstake.date" }),
        accessor: "date",
      },
    ],
    [],
  );

  const data = useMemo(
    () =>
      program.unstaking.map((u) => ({
        amount: (
          <Value>
            <NumberFormat
              value={u.amount}
              displayType="text"
              thousandSeparator={true}
              decimalScale={coin.decimals}
              suffix={` ${u.coin}`}
            />
          </Value>
        ),
        date: <Value>{formatDateTimeUTC(u.receiveDate)}</Value>,
      })),
    [],
  );

  return (
    <CustomModal onClose={onClose} newTheme={true} persist={false} size="medium" state={open}>
      <Modal>
        <Title>
          <img src={PiggyIcon} width={40} height={40} />
          <FormattedMessage id="vault.unstake.progress.title" />
        </Title>
        <StyledTextDesc>
          <FormattedMessage id="vault.unstake.progress.desc" />
        </StyledTextDesc>
        <TableLayout>
          <Table data={data} columns={columns} />
        </TableLayout>
        <Box display="flex" mt="28px">
          <Button variant="outlined" onClick={onCancel}>
            <FormattedMessage id="accounts.back" />
          </Button>
        </Box>
      </Modal>
    </CustomModal>
  );
};

export default PendingUnstakingModal;
