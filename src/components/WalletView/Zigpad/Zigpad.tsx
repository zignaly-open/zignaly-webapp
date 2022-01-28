import {
  Box,
  CircularProgress,
  Typography,
  Button as ButtonMui,
  useMediaQuery,
  Tabs,
  Tab,
  Icon,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { AlignCenter, isMobile, Title } from "styles/styles";
import RocketIcon from "images/launchpad/rocket.svg";
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
import OpenArrowIcon from "images/launchpad/openArrow.inline.svg";
import Button from "components/Button";
import { zigpadInfoUrl } from "utils/affiliateURLs";

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

const StyledChevronRight = styled(ChevronRight)`
  margin-right: -9px;
`;

const StyledTerms = styled(Terms)`
  margin-top: 2px;
`;

const StyledTableLayout = styled(TableLayout)`
  /* table {
    tbody tr:hover {
      background-color: rgba(25, 25, 39, 0.04);
      cursor: pointer;
    }
  } */
`;

const StyledPledgeButton = styled.div`
  button {
    width: 100%;
  }
`;

const TypographyBenefits = styled(Typography)`
  margin-bottom: 8px;
  line-height: 26px;

  div {
    display: inline-flex;
    flex-direction: column;
    &:not(:last-child) {
      margin-right: 55px;
      ${isMobile(css`
        margin: 0;
      `)}
    }
  }
`;

const TypographyInfo = styled(Typography)`
  padding-right: 125px;
  margin-top: 4px;
  line-height: 26px;
  ${isMobile(css`
    padding: 0;
  `)}
`;

const HelpButton = styled(Button)`
  display: inline;
`;

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "gaming":
      return SportsEsports;
    case "meme":
      return SportsEsports;
    case "platform":
      return SportsEsports;
    default:
      return null;
  }
};
const CategoryIcon = ({ category }: { category: string }) => {
  let IconMatch = getCategoryIcon(category);

  if (!IconMatch) {
    return null;
  }

  return (
    <Icon role="img" title={category} style={{ marginRight: "4px" }}>
      <IconMatch width={24} height={24} />
    </Icon>
  );
};

const Zigpad = ({ isOpen }: { isOpen: boolean }) => {
  const intl = useIntl();
  const [launchpadProjects, setLaunchpadProjects] = useState<LaunchpadProject[]>(null);
  const [selectedProject, setSelectedProject] = useState<LaunchpadProject>(null);
  const theme = useTheme();
  const isMobileQuery = useMediaQuery(theme.breakpoints.down("sm"));
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
              Header: "",
              accessor: "distribution",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.project" }),
              accessor: "project",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.minContribution" }),
              accessor: "minAmount",
            },
            {
              Header: intl.formatMessage({ id: "zigpad.subscriptionDate" }),
              accessor: "subscriptionDate",
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
                icon={p.logo}
                amount={p.offeredAmount}
                coin={p.coin}
                zigpadVariant={true}
                progress={p.progress}
              />
            ) : (
              <CoinIcon coin={p.coin} />
            )}
          </AlignCenter>
        ),
        project: (
          <AlignCenter direction="column">
            <Typography style={{ fontWeight: 600, textAlign: "center" }}>
              <Box display="flex" justifyContent="center" whiteSpace="nowrap">
                <CategoryIcon category={p.category} />
                {p.name}
              </Box>
            </Typography>
            <StyledTerms onClick={() => setSelectedProject(p)}>
              <FormattedMessage id="zigpad.details" />
              <StyledChevronRight />
            </StyledTerms>
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
        subscriptionDate: (
          <Value style={{ textAlign: "center", whiteSpace: "normal" }}>
            {dayjs(p.startDate).format("MMM D")} - {dayjs(p.calculationDate).format("MMM D, YYYY")}
          </Value>
        ),
        distributionDate: <Value>{dayjs(p.distributionDate).format("MMM D, YYYY")}</Value>,
        endDate: <Value>{dayjs(p.calculationDate).format("MMM D, YYYY")}</Value>,
        price: (
          <Value>
            {p.price}$
            <Rate>
              {rateZIG ? (
                <NumberFormat
                  displayType="text"
                  value={p.price / rateZIG}
                  suffix=" ZIG"
                  prefix="≈"
                  thousandSeparator={true}
                  decimalScale={2}
                />
              ) : (
                "-"
              )}
            </Rate>
          </Value>
        ),
        actions: (
          <StyledPledgeButton>
            <PledgeButton onClick={() => setSelectedProject(p)} project={p} />
          </StyledPledgeButton>
        ),
        id: p.id,
      })),
    [launchpadProjects, tab, rateZIG],
  );

  const onRowClick = useCallback(
    (row) => {
      // const project = launchpadProjects.find((p) => p.id === row.original.id);
      // setSelectedProject(project);
    },
    [launchpadProjects],
  );

  const parseTranslationList = (id: string) => intl.formatMessage({ id }).split("\n");

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
        <img src={RocketIcon} width={40} height={40} style={{ marginLeft: "28px" }} />
        <FormattedMessage id="zigpad.title" />
      </Title>
      <TypographyInfo>
        <FormattedMessage id="zigpad.info" />
        <HelpButton href={zigpadInfoUrl} endIcon={<OpenArrowIcon />} variant="text">
          <FormattedMessage id="zigpad.faq" />
        </HelpButton>
      </TypographyInfo>
      <Typography style={{ marginTop: "22px", marginBottom: "8px", fontWeight: 600 }}>
        <FormattedMessage id="vault.benefits" />
      </Typography>
      <TypographyBenefits>
        <div>
          {parseTranslationList("zigpad.benefits.info").map((t, i) => (
            <div key={i}>{t}</div>
          ))}
        </div>
        <div>
          {parseTranslationList("zigpad.benefits.info2").map((t, i) => (
            <div key={i}>{t}</div>
          ))}
        </div>
      </TypographyBenefits>
      <Box mt="28px">
        {data ? (
          <>
            <StyledTabs onChange={(e, v) => setTab(v)} value={tab} style={{ marginBottom: "16px" }}>
              <StyledTab label={<FormattedMessage id="zigpad.active" />} />
              <StyledTab label={<FormattedMessage id="zigpad.past" />} />
            </StyledTabs>
            {isMobileQuery ? (
              <ProjectsMobile
                projects={launchpadProjects}
                type={tab === 0 ? "active" : "expired"}
                onProjectClick={setSelectedProject}
              />
            ) : (
              <StyledTableLayout>
                <Table data={data} columns={columns} onRowClick={onRowClick} />
              </StyledTableLayout>
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
