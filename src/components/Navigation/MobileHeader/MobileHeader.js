import React, { useState } from 'react';
import './MobileHeader.scss';
import { Box, Grow, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import CustomButton from '../../CustomButton';
import Enabled from '../../../images/header/enabled.svg';
import EnabledWhite from '../../../images/header/enabledWhite.svg';
import Disabled from '../../../images/header/disabled.svg';
import DisabledWhite from '../../../images/header/disabledWhite.svg';
import UserExchangeList from './UserExchangeList';

const MobileHeader = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)
    const [showBalance, setShowBalance] = useState(false)
    const [connected, setConnected] = useState(false)


    return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" className={"mobileHeader"}>
            {connected &&
                <Box className="connectedBox" display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
                    <Box className={"actionBox"} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                        <UserExchangeList />
                        <Box className="iconBox" onClick={() => setShowBalance(!showBalance)} display="flex" flexDirection="row" justifyContent="flex-end" alignItems="center">
                            {darkStyle && <img src={showBalance ? DisabledWhite : EnabledWhite} className={"expandIcon"} alt="zignaly" />}
                            {!darkStyle && <img src={showBalance ? Disabled : Enabled} className={"expandIcon"} alt="zignaly" />}
                            <Typography variant="h4">Balance</Typography>
                        </Box>
                    </Box>
                    {showBalance &&
                        <Grow in={true}>
                            <Box className="balanceContainer" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
                                <Box className="balanceBox" display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="subtitle1" className="title">available balance</Typography>
                                    <Typography variant="h5" className="balance">btc 0.256</Typography>
                                </Box>
                                <Box className="balanceBox" display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="subtitle1" className="title">invested</Typography>
                                    <Typography variant="h5" className="balance">btc 0.452</Typography>
                                </Box>
                                <Box className="balanceBox" display="flex" flexDirection="column" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="subtitle1" className="title">p/l</Typography>
                                    <Typography variant="h5" className="balance green">btc +0.47</Typography>
                                </Box>
                            </Box>
                        </Grow>
                    }
                </Box>
            }
            {!connected && <CustomButton onClick={() => setConnected(true)} className="header-btn">Connect Account</CustomButton>}
        </Box>
    )
}

export default MobileHeader;