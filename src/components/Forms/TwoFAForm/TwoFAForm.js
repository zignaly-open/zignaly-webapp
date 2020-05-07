import React, {Component} from 'react';
import './TwoFAForm.sass';
import {Box} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
// import {verify2FA} from 'actions';
import ReactCodeInput from 'react-verification-code-input';

class TwoFAForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            code: "",
            codeError: false,
            loading: false
        }
    }

    handleCodeChange = (e) => {
        this.setState({
            code: e,
            codeError: e.length === 6 ? false : true
        })
    }

    handleSubmit = () => {
        this.setState({loading: true})
        // this.props.dispatch(verify2FA(this.props.user.token, this.state.code));
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit()
        }
    }

    showLoader = () => {
        this.setState({loading: true})
    }

    hideLoader = () => {
        this.setState({loading: false})
    }

    disabledButton = () => {
        if(this.state.code && !this.state.codeError ){
            return false
        }
        return true
    }

    render(){
        return(
            <Box className="twoFA-form" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <span className="boxTitle">2 Factor Authentication</span>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="center">
                    <label className="custom-label">Input Your Authentication Code</label>
                    <ReactCodeInput fields={6} onChange={this.handleCodeChange} onComplete={this.handleKeyPress} />
                    {this.state.codeError && <span className="error-text">Code must be of 6 digits!</span>}
                </Box>

                <Box className="input-box" display="flex" flexDirection="row" justifyContent="center">
                    <CustomButton
                        className={"full " + (this.disabledButton() ? "disabled-btn" : "submit-btn")}
                        disabled={this.disabledButton()}
                        loading={this.state.loading}
                        onClick= {this.handleSubmit}>Sign in</CustomButton>
                </Box>
            </Box>
        )
    }
}

export default TwoFAForm;