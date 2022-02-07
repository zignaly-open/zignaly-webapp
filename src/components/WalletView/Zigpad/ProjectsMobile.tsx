import { Box, Typography } from "@material-ui/core";
import dayjs from "dayjs";
import React from "react";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
import styled from "styled-components";
import { SecondaryText } from "styles/styles";
import { PledgeButton } from "../Vault/VaultDepositButton";
import RewardsProgressCircle from "../Vault/RewardsProgressCircle";
import { Coin, Panel } from "../Vault/VaultMobile";
import { Terms } from "../styles";
import { ChevronRight } from "@material-ui/icons";
import CoinIcon from "../CoinIcon";

const TypographyProject = styled(Typography)`
  font-weight: 600;
  margin: 0 16px;
  line-height: 20px;
  text-align: "center";
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
            <img width={32} height={32} src={p.logo} />
            <TypographyProject>
              <div>{p.name}</div>
              <Terms onClick={() => onProjectClick(p)}>
                <FormattedMessage id="zigpad.details" />
                <ChevronRight />
              </Terms>
            </TypographyProject>
            <Box flex={1} display="flex" justifyContent="flex-end">
              <PledgeButton onClick={() => onProjectClick(p)} project={p} />
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mt="8px">
            <div>
              <Label>
                <FormattedMessage id="vault.startsEnds" />
              </Label>
              <Box display="flex">
                <StartDate>{dayjs(p.startDate).format("MMM D")}</StartDate>
                {dayjs(p.calculationDate).format("MMM D, YYYY")}
              </Box>
            </div>
            <div>
              <Label>
                <FormattedMessage id="zigpad.minContribution" />
              </Label>
              <Amount>
                <NumberFormat displayType="text" value={p.minAmount} thousandSeparator={true} />
                <Coin>ZIG</Coin>
              </Amount>
            </div>
            <div>
              <Label>
                <FormattedMessage id="terminal.price" />
              </Label>
              <Amount>
                <NumberFormat displayType="text" value={p.price} />
                <Coin>$</Coin>
              </Amount>
            </div>
          </Box>
        </Panel>
      ))}
    </Box>
  );
};

export default ProjectsMobile;
