import React, {Component} from 'react';
import './ForgotPasswordForm.sass';
import {Box, TextField} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
// import {recover1} from 'actions';
import { validateEmail } from '../../../helpers/validators';

class TwoFAForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: "",
            emailError: false,
            loading: false
        }
    }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
            emailError: validateEmail(e.target.value) ? false : true
        })
    }

    handleSubmit = () => {
        this.showLoader()
        const params = {
            email: this.state.email,
            password: this.state.password,
            array: true
        }
        // this.props.dispatch(recover1(params, this.hideLoader));
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
        if(this.state.email && !this.state.emailError){
            return false
        }
        return true
    }

    render(){
        return(
            <Box className="twoFA-form" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <h3>Password Recovery Form</h3>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Enter your email address</label>
                    <TextField
                        className="custom-input"
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={this.state.emailError}
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        onKeyDown={this.handleKeyPress}
                        />
                    {this.state.emailError && <span className="error-text">email should be valid</span>}
                </Box>

                <Box className="input-box">
                    <CustomButton
                        className={"full " + (this.disabledButton() ? "disabled-btn" : "submit-btn")}
                        disabled={this.disabledButton()}
                        loading={this.state.loading}
                        onClick= {this.handleSubmit}>Recover Account</CustomButton>
                </Box>
            </Box>
        )
    }
}

export default TwoFAForm;