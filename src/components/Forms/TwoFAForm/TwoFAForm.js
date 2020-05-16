import React, {useState} from 'react';
import './TwoFAForm.scss';
import {Box} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
// import {verify2FA} from 'actions';
import ReactCodeInput from 'react-verification-code-input';

const TwoFAForm = (props) => {
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [codeError, setCodeError] = useState(false)

    handleCodeChange = (e) => {
        setCode(e.length === 6)
        if(e.length === 6){
            setCodeError(false)
        } else {
            setCodeError(true)
        }
    }

    handleSubmit = () => {
        setLoading(true)
        // this.props.dispatch(verify2FA(this.props.user.token, this.state.code));
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    disabledButton = () => {
        if(this.state.code && !this.state.codeError ){
            return false
        }
        return true
    }

    return(
        <Box className="twoFA-form" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
            <span className="boxTitle">2 Factor Authentication</span>
            <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="center">
                <label className="custom-label">Input Your Authentication Code</label>
                <ReactCodeInput fields={6} onChange={handleCodeChange} onComplete={handleKeyPress} />
                {codeError && <span className="error-text">Code must be of 6 digits!</span>}
            </Box>

            <Box className="input-box" display="flex" flexDirection="row" justifyContent="center">
                <CustomButton
                    className={"full " + (disabledButton() ? "disabled-btn" : "submit-btn")}
                    disabled={disabledButton()}
                    loading={loading}
                    onClick= {handleSubmit}>Sign in</CustomButton>
            </Box>
        </Box>
    )
}

export default TwoFAForm;