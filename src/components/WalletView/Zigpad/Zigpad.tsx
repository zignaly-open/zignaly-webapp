import {
  Box,
  CircularProgress,
  Typography,
  Button as ButtonMui,
  useMediaQuery,
  Tabs,
  Tab,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AlignCenter, Title } from "styles/styles";
import WalletIcon from "images/wallet/wallet.svg";
import Table, { TableLayout } from "../Table";
import RewardsProgressBar from "../Vault/RewardsProgressBar";
import tradeApi from "services/tradeApiClient";
import styled, { css } from "styled-components";
import { ArrowBack, ChevronRight, SportsEsports } from "@material-ui/icons";
import NumberFormat from "react-number-format";
import CoinIcon from "../CoinIcon";
import dayjs from "dayjs";
import { Rate, Terms } from "../styles";
import { PledgeButton } from "../Vault/VaultDepositButton";
import ProjectDetailsModal from "./ProjectDetailsModal";
import ProjectsMobile from "./ProjectsMobile";
import { format2Dec } from "utils/formatters";

const Coin = styled.span`
  color: #65647e;
  font-size: 11px;
  margin: 0 5px 0 4px;
`;

const Value = styled(Typography)`
  font-weight: 600;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
`;

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background: linear-gradient(289.8deg, #149cad 0%, #4540c1 100%);
    border-radius: 6px;

    ${({ theme }) =>
      theme.palette.type === "light" &&
      css`
        background: linear-gradient(
          121.21deg,
          #a600fb 10.7%,
          #6f06fc 31.3%,
          #4959f5 60.13%,
          #2e8ddf 76.19%,
          #12c1c9 89.78%
        );
      `}
  }
`;

const StyledTab = styled(Tab)`
  text-transform: none;
  font-weight: 600;
`;

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "gaming":
      return <SportsEsports />;
    case "meme":
    default:
      return <SportsEsports />;
  }
};

const Zigpad = ({ isOpen }: { isOpen: boolean }) => {
  const intl = useIntl();
  const [launchpadProjects, setLaunchpadProjects] = useState<LaunchpadProject[]>(null);
  const [selectedProject, setSelectedProject] = useState<LaunchpadProject>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [tab, setTab] = useState(0);
  const [rateZIG, setRateZIG] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setLaunchpadProjects(null);
      tradeApi.getLaunchpadProjects({ status: tab === 0 ? "active" : "past" }).then((response) => {
        setLaunchpadProjects(response);
      });
    }
  }, [isOpen, tab]);

  useEffect(() => {
    tradeApi.getWalletCoins().then((response) => {
      setRateZIG(response.ZIG.usdPrice);
    });
  }, []);

  const columns = useMemo(
    () =>
      tab === 0
        ? [
            {
              Header: intl.formatMessage({ id: "zigpad.remaning" }),
              accessor: "distribution",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.project" }),
              accessor: "project",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.category" }),
              accessor: "category",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.minContribution" }),
              accessor: "minAmount",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.endDate" }),
              accessor: "endDate",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.distributionDate" }),
              accessor: "distributionDate",
            },
            {
              Header: intl.formatMessage({ id: "terminal.price" }),
              accessor: "price",
            },
            {
              Header: "",
              accessor: "actions",
            },
          ]
        : [
            {
              Header: intl.formatMessage({ id: "zigpad.project" }),
              accessor: "coin",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.category" }),
              accessor: "category",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.offered" }),
              accessor: "offeredAmount",
            },
            {
              Header: intl.formatMessage({ id: "vault.ended" }),
              accessor: "endDate",
            },
          ],
    [tab],
  );

  const data = useMemo(
    () =>
      launchpadProjects &&
      launchpadProjects.map((p) => ({
        distribution: (
          <AlignCenter>
            {tab === 0 ? (
              <RewardsProgressBar
                amountTotal={p.offeredAmount}
                amountRemaining={p.offeredAmount - p.distributedAmount}
                coin={p.coin}
              />
            ) : (
              <CoinIcon coin={p.coin} />
            )}
          </AlignCenter>
        ),
        project: (
          <AlignCenter>
            <Typography style={{ fontWeight: 600, textAlign: "center" }}>
              {p.name}
              &nbsp;
              <Terms onClick={() => setSelectedProject(p)}>
                <FormattedMessage id="zigpad.details" />
                <ChevronRight />
              </Terms>
            </Typography>
          </AlignCenter>
        ),
        coin: (
          <AlignCenter>
            <CoinIcon width={16} height={16} coin={p.coin} />
            <Typography style={{ fontWeight: 600, marginLeft: "8px" }}>
              {p.coin}
              &nbsp;&nbsp;
              <Terms onClick={() => setSelectedProject(p)}>
                <FormattedMessage id="zigpad.details" />
                <ChevronRight />
              </Terms>
            </Typography>
          </AlignCenter>
        ),
        category: (
          <AlignCenter>
            {getCategoryIcon(p.category)}
            <Value style={{ marginLeft: "8px" }}>
              <FormattedMessage id={`zigpad.category.${p.category.toLowerCase()}`} />
            </Value>
          </AlignCenter>
        ),
        minAmount: (
          <Value>
            <NumberFormat displayType="text" value={p.minAmount} thousandSeparator={true} />
            <Coin>ZIG</Coin>
          </Value>
        ),
        offeredAmount: (
          <Value>
            <NumberFormat displayType="text" value={p.offeredAmount} thousandSeparator={true} />
            <Coin>{p.coin}</Coin>
          </Value>
        ),
        endDate: <Value>{dayjs(p.endDate).format("MMM D, YYYY")}</Value>,
        distributionDate: <Value>{dayjs(p.distributionDate).format("MMM D, YYYY")}</Value>,
        price: (
          <Value>
            @{p.price} ZIG
            <Rate>{rateZIG ? format2Dec(p.price * rateZIG) : "-"}$</Rate>
          </Value>
        ),
        actions: <PledgeButton onClick={() => setSelectedProject(p)} pledged={p.pledged} />,
      })),
    [launchpadProjects, tab, rateZIG],
  );

  return (
    <>
      {selectedProject && (
        <ProjectDetailsModal
          onClose={() => setSelectedProject(null)}
          open={true}
          projectId={selectedProject.id}
        />
      )}
      <Title>
        <ButtonMui href="#wallet" variant="outlined" color="grid.content" startIcon={<ArrowBack />}>
          <FormattedMessage id="accounts.back" />
        </ButtonMui>
        <img src={WalletIcon} width={40} height={40} style={{ marginLeft: "28px" }} />
        <FormattedMessage id="zigpad.title" />
      </Title>
      <Box mt="28px">
        {data ? (
          <>
            <StyledTabs onChange={(e, v) => setTab(v)} value={tab} style={{ marginBottom: "16px" }}>
              <StyledTab label={<FormattedMessage id="zigpad.active" />} />
              <StyledTab label={<FormattedMessage id="zigpad.past" />} />
            </StyledTabs>
            {isMobile ? (
              <ProjectsMobile
                projects={launchpadProjects}
                type={tab === 0 ? "active" : "expired"}
                onProjectClick={setSelectedProject}
              />
            ) : (
              <TableLayout>
                <Table data={data} columns={columns} />
              </TableLayout>
            )}
          </>
        ) : (
          <Box display="flex" flex={1} justifyContent="center">
            <CircularProgress color="primary" size={40} />
          </Box>
        )}
      </Box>
    </>
  );
};
export default Zigpad;
