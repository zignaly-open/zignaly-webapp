import React, { useCallback, useContext, useState } from "react";
import { Box, Grow, Typography, Popper, ClickAwayListener } from "@material-ui/core";
import LogoWhite from "../../../images/logo/logoNW.svg";
import LogoBlack from "../../../images/logo/logoNB.svg";
import ProfileIcon from "../../../images/header/profileIcon.svg";
import { useDispatch } from "react-redux";
import LeftIcon from "../../../images/header/chevron-left.svg";
import RightIcon from "../../../images/header/chevron-right.svg";
import UserExchangeList from "./UserExchangeList";
import BalanceBox from "./TopBalance";
import { FormattedMessage } from "react-intl";
import UserMenu from "./UserMenu";
import useStoreSettingsSelector from "../../../hooks/useStoreSettingsSelector";
import {
  useStoreUserExchangeConnections,
  useStoreUserData,
} from "../../../hooks/useStoreUserSelector";
import { toggleBalanceBox } from "../../../store/actions/settings";
import "./Header.scss";
import DownIconPurple from "../../../images/header/chevronDownPurple.svg";
import DownIcon from "../../../images/header/chevron-down.svg";
import ProviderLogo from "../../Provider/ProviderHeader/ProviderLogo";
import PrivateAreaContext from "context/PrivateAreaContext";
import CustomButton from "components/CustomButton";
import { Link } from "gatsby";
import useSelectedExchange from "hooks/useSelectedExchange";
import WalletButton from "./WalletButton";
import { useTz } from "services/tz";

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

const Header = () => {
  const track = useTz();
  const selectedExchange = useSelectedExchange();
  const storeSettings = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [anchorEl, setAnchorEl] = useState(undefined);
  const storeUserData = useStoreUserData();
  const dispatch = useDispatch();
  const { connectedProviders, balance, showInviteModal } = useContext(PrivateAreaContext);
  const connectedProvidersCount = connectedProviders
    ? connectedProviders.filter((p) =>
        p.exchangeInternalIds.find((e) => e.internalId === selectedExchange.internalId),
      ).length
    : null;
  const hasFunds = balance?.totalUSDT + balance?.totalLockedUSDT > 0;
  const showBalance = storeSettings.balanceBox;
  const balanceReady = balance && connectedProvidersCount !== null;

  let showAddFunds = false;
  let showFindTraders = false;
  if (!connectedProvidersCount && selectedExchange.exchangeName.toLowerCase() === "zignaly") {
    if (!hasFunds) {
      showAddFunds = true;
    } else {
      showFindTraders = true;
    }
  }
  const hasOnlyNonBrokerAccount =
    exchangeConnections.length === 1 &&
    exchangeConnections[0].exchangeName.toLowerCase() !== "zignaly";

  const showHideBalance = () => {
    dispatch(toggleBalanceBox(!showBalance));
  };

  const Balance = useCallback(
    () => (
      <Box
        alignItems="center"
        className={"balanceWrapper " + (showBalance ? "full" : "")}
        display="flex"
        flexDirection="row"
        justifyContent="flex-start"
      >
        <Box
          alignItems="center"
          className="iconBox"
          display="flex"
          flexDirection="row"
          justifyContent="center"
        >
          <img
            alt="zignaly"
            className={"expandIcon"}
            onClick={showHideBalance}
            src={showBalance ? RightIcon : LeftIcon}
          />
        </Box>
        {showBalance ? (
          <BalanceBox />
        ) : (
          <Grow in={true}>
            <Box className="iconBox" display="flex" flexDirection="column" justifyContent="center">
              <Typography variant="h4">
                <FormattedMessage id="dashboard.balance" />
              </Typography>
            </Box>
          </Grow>
        )}
      </Box>
    ),
    [showBalance],
  );

  return (
    <Box
      alignItems="center"
      className={"header"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <Box alignItems="center" className={"logoContainer"} display="flex" flexDirection="row">
        <Link to="/dashboard">
          <img
            alt="zignaly-logo"
            className={"headerLogo"}
            src={storeSettings.darkStyle ? LogoWhite : LogoBlack}
          />
        </Link>
      </Box>
      {/* <div>
        <FormattedMessage id="menu.profitSharing" />
        <FormattedMessage id="menu.copytraders" />
        <FormattedMessage id="menu.signals" />
        <FormattedMessage id="menu.tradingterminal" />
        <FormattedMessage id="menu.tradingservices" />
      </div> */}
      <Box
        alignItems="center"
        className="linksContainer"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        {exchangeConnections.length ? (
          <>
            {balanceReady && (
              <>
                {!showAddFunds ? (
                  <>
                    <Balance />
                    {hasOnlyNonBrokerAccount ? (
                      <CustomButton className="textPurple" component={Link} to="/profitSharing">
                        <FormattedMessage id="accounts.startps" />
                      </CustomButton>
                    ) : showFindTraders ? (
                      <CustomButton className="textPurple" component={Link} to="/profitSharing">
                        <FormattedMessage id="accounts.findtraders" />
                      </CustomButton>
                    ) : (
                      <CustomButton
                        className="textPurple"
                        onClick={() => {
                          track("invite-cta");
                          showInviteModal(true);
                        }}
                      >
                        <FormattedMessage id="accounts.invite" />
                      </CustomButton>
                    )}
                  </>
                ) : (
                  <CustomButton className="textPurple" href="#exchangeAccounts" id="add-funds-cta">
                    <FormattedMessage id="accounts.addfunds" />
                  </CustomButton>
                )}
              </>
            )}
            {exchangeConnections.length > 1 && <UserExchangeList />}
            <WalletButton />
          </>
        ) : (
          <CustomButton className="headerButton" href="#exchangeAccounts">
            <FormattedMessage id="menu.connectexchange" />
          </CustomButton>
        )}
        <ClickAwayListener onClickAway={() => setAnchorEl(undefined)}>
          <Box className="linkBox">
            <Box className="iconOpen" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <ProviderLogo
                defaultImage={ProfileIcon}
                size="32px"
                title=""
                url={storeUserData.imageUrl}
                verified={storeUserData.verified}
              />
              <img className="arrow" src={storeSettings.darkStyle ? DownIcon : DownIconPurple} />
            </Box>
            <Popper
              anchorEl={anchorEl}
              className="popper"
              open={Boolean(anchorEl)}
              placement="bottom-start"
              transition
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps} timeout={350}>
                  <Box bgcolor="grid.main" className="menuWrapper">
                    <UserMenu onClose={() => setAnchorEl(undefined)} />
                  </Box>
                </Grow>
              )}
            </Popper>
          </Box>
        </ClickAwayListener>
      </Box>
    </Box>
  );
};

export default Header;
