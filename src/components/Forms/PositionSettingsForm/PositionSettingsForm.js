import React from 'react';
import './PositionSettingsForm.sass';
import {Box} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';

const PositionSettingsForm = (props) => {

    const handleSubmit = () => {

    }

    return(
        <Box className="positionSettingsForm" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <span className="boxTitle">Configure Positions Table</span>
            <Box className="form">

            </Box>
            <Box className="input-box" display="flex" flexDirection="row" justifyContent="center">
                <CustomButton className={"submit-btn"} onClick= {handleSubmit}>Save Preference</CustomButton>
            </Box>
        </Box>
    )
}

export default PositionSettingsForm;