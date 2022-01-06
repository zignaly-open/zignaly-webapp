import { Box } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import styled from "styled-components";
import { SecondaryText } from "styles/styles";
import { PledgeButton } from "../Vault/VaultDepositButton";
import RewardsProgressCircle from "../Vault/RewardsProgressCircle";
import { Coin, Panel } from "../Vault/VaultMobile";

const EarnText = styled.div`
  font-weight: 600;
  margin: 0 16px;
  line-height: 20px;
`;

const Label = styled(SecondaryText)`
  font-weight: 600;
  font-size: 12px;
`;

const StartDate = styled(SecondaryText)`
  margin-right: 12px;
`;

const Amount = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
`;

interface ProjectsMobileProps {
  projects: LaunchpadProject[];
  onProjectClick: (p: LaunchpadProject) => void;
}

const ProjectsMobile = ({ projects, onProjectClick }: ProjectsMobileProps) => {
  return (
    <Box>
      {projects.map((p) => (
        <Panel key={p.name}>
          <Box display="flex" alignItems="center">
            <RewardsProgressCircle
              rewardsTotal={p.offeredAmount}
              rewardsRemaining={p.offeredAmount - p.distributedAmount}
            />
            <EarnText>{p.name}</EarnText>
            <Box flex={1} display="flex" justifyContent="flex-end">
              <PledgeButton onClick={() => onProjectClick(p)} activated={p.coin === "ETH"} />
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mt="8px">
            <div>
              <Label>
                <FormattedMessage id="vault.startsEnds" />
              </Label>
              <Box display="flex">
                <StartDate>{dayjs(p.startDate).format("MMM D")}</StartDate>
                {dayjs(p.endDate).format("MMM D, YYYY")}
              </Box>
            </div>
            <div>
              <Label>
                <FormattedMessage id="zigpad.minContribution" />
              </Label>
              <Amount>
                <NumberFormat displayType="text" value={p.minAmount} />
                <Coin>ZIG</Coin>
              </Amount>
            </div>
            <div>
              <Label>
                <FormattedMessage id="terminal.price" />
              </Label>
              <Amount>
                <NumberFormat displayType="text" value={p.price} />
                <Coin>ZIG</Coin>
              </Amount>
            </div>
          </Box>
        </Panel>
      ))}
    </Box>
  );
};

export default ProjectsMobile;
