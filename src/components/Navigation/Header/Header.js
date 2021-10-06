import React, { useCallback, useContext, useState } from "react";
import { Box, Grow, Typography, Popper } from "@material-ui/core";
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

/**
 * @typedef {import('../../../store/initialState').DefaultState} DefaultState
 * @typedef {import('../../../services/tradeApiClient.types').ExchangeConnectionEntity} ExchangeConnectionEntity
 */

const Header = () => {
  const storeSettings = useStoreSettingsSelector();
  const exchangeConnections = useStoreUserExchangeConnections();
  const [anchorEl, setAnchorEl] = useState(undefined);
  const storeUserData = useStoreUserData();
  const dispatch = useDispatch();
  const { profitSharingCount, balance } = useContext(PrivateAreaContext);

  const hasFunds = balance.totalUSDT + balance.totalLockedUSDT > 0;
  const hasConnectedProfitSharing = profitSharingCount > 0;
  const showBalance = storeSettings.balanceBox;

  let showAddFunds = false;
  let showFindTraders = false;
  const hasOnlyDefaultExchangeAccount =
    exchangeConnections.length === 1 &&
    exchangeConnections[0].exchangeName.toLowerCase() === "zignaly";
  if (hasOnlyDefaultExchangeAccount && !hasConnectedProfitSharing) {
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
      <Box
        alignItems="center"
        className="linksContainer"
        display="flex"
        flexDirection="row"
        justifyContent="flex-end"
      >
        {exchangeConnections.length > 0 &&
          (!showAddFunds && !showFindTraders ? (
            <Balance />
          ) : showAddFunds ? (
            <CustomButton className="customButton textPurple" href="#exchangeAccounts">
              <FormattedMessage id="accounts.addfunds" />
            </CustomButton>
          ) : (
            <CustomButton className="customButton textPurple" component={Link} to="/profitSharing">
              <FormattedMessage id="accounts.findtraders" />
            </CustomButton>
          ))}
        {hasOnlyNonBrokerAccount && (
          <CustomButton className="customButton textPurple" component={Link} to="/profitSharing">
            <FormattedMessage id="accounts.startps" />
          </CustomButton>
        )}
        {exchangeConnections.length > 1 && <UserExchangeList />}
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
                <Box
                  bgcolor="grid.main"
                  className="menuWrapper"
                  onMouseLeave={() => setAnchorEl(undefined)}
                >
                  <UserMenu onClose={() => setAnchorEl(undefined)} />
                </Box>
              </Grow>
            )}
          </Popper>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
