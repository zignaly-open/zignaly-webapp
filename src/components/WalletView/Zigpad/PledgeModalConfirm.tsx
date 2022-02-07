import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { Label, Modal, Title } from "styles/styles";
import tradeApi from "services/tradeApiClient";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { showErrorAlert } from "store/actions/ui";
import RocketIcon from "images/launchpad/rocket.svg";
import Button from "components/Button";
import { Box, Typography } from "@material-ui/core";
import NumberFormat from "react-number-format";
import { ErrorOutlineOutlined } from "@material-ui/icons";

const TypographyValue = styled(Typography)`
  font-size: 18px;
  font-weight: bold;
`;

const StyledLabel = styled(Label)`
  margin-top: 24px;
`;

const StyledButton = styled(Button)`
  min-width: 125px;
  margin-left: 12px;
`;

const StyledErrorOutlined = styled(ErrorOutlineOutlined)`
  margin-right: 7px;
  color: ${({ theme }) => theme.newTheme.error};
`;

const TypographyError = styled(Typography)`
  color: ${({ theme }) => theme.newTheme.error};
  font-weight: 500;
  font-size: 15px;
`;

interface PledgeModalConfirmProps {
  project: LaunchpadProject;
  amount: number;
  onPledged: (amount: number) => void;
  onCancel: () => void;
}

const PledgeModalConfirm = ({ project, onPledged, amount, onCancel }: PledgeModalConfirmProps) => {
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onSubmit = () => {
    setLoading(true);
    tradeApi
      .pledge(project.id, amount)
      .then(() => {
        onPledged(amount);
      })
      .catch((e) => {
        dispatch(showErrorAlert(e));
        setLoading(false);
      });
  };

  return (
    <Modal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Title>
          <img src={RocketIcon} width={40} height={40} />
          <FormattedMessage id="zigpad.pledge.confirm.title" values={{ project: project.name }} />
        </Title>
        <Typography>
          <FormattedMessage id="zigpad.pledge.confirm.desc" />
        </Typography>
        <StyledLabel>
          <FormattedMessage id="zigpad.pledge.confirm.program" />
        </StyledLabel>
        <Box display="flex" alignItems="center">
          <img width={40} height={40} src={project.logo} />
          <TypographyValue style={{ marginLeft: "16px" }}>{project.name}</TypographyValue>
        </Box>
        <StyledLabel>
          <FormattedMessage id="zigpad.pledge.confirm.amount" />
        </StyledLabel>
        <TypographyValue>
          <NumberFormat displayType="text" value={amount} suffix=" ZIG" thousandSeparator={true} />
        </TypographyValue>
        <Box display="flex" my={3}>
          <StyledErrorOutlined width={24} height={24} />
          <TypographyError>
            <FormattedMessage id="zigpad.pledge.confirm.notice" />
          </TypographyError>
        </Box>
        <Button variant="outlined" onClick={onCancel}>
          <FormattedMessage id="accounts.back" />
        </Button>
        <StyledButton variant="contained" type="submit" loading={loading}>
          <FormattedMessage id="zigpad.pledge" />
        </StyledButton>
      </form>
    </Modal>
  );
};

export default PledgeModalConfirm;
