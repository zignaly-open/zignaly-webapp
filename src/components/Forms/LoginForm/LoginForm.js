import React, {Component} from 'react';
import './LoginForm.sass';
import common from '../../../styles/common.module.sass';
import {Box, TextField, FormControl, InputAdornment, OutlinedInput, IconButton} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
import {validateEmail} from '../../../helpers/validators';
import Modal from '../../Modal';
import ForgotPasswordForm from '../ForgotPasswordForm';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class LoginForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            email: "",
            password: "",
            emailError: false,
            passwordError: false,
            loading: false,
            modal: false,
            showPassword: false,
        }
    }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
            emailError: validateEmail(e.target.value) ? false : true
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
            passwordError: e.target.value ? false : true
        })
    }

    handleSubmit = () => {
        this.showLoader()
        this.props.dispatch(login(this.state.email, this.state.password, projectId, this.hideLoader));
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
        if(this.state.email && this.state.password){
            if(!this.state.emailError && !this.state.passwordError){
                return false
            }
            return true
        }
        return true
    }

    render(){
        return(
            <Box className="loginForm" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Modal state={this.state.modal} onClose={() => this.setState({modal: false})} persist={false}>
                    <ForgotPasswordForm dispatch={this.props.dispatch} />
                </Modal>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Email address</label>
                    <TextField
                        className={common.customInput}
                        type="email"
                        fullWidth
                        variant="outlined"
                        error={this.state.emailError}
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        onKeyDown={this.handleKeyPress}
                        />
                    {this.state.emailError && <span className="error-text">Email should be valid</span>}
                </Box>

                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Password</label>
                    <FormControl className={common.customInput} variant="outlined">
                        <OutlinedInput
                            type={this.state.showPassword ? 'text' : 'password'}
                            value={this.state.password}
                            error={this.state.passwordError}
                            onChange={this.handlePasswordChange}
                            onKeyDown={this.handleKeyPress}
                            endAdornment={
                                <InputAdornment position="end">
                                    <span className={common.pointer} onClick={() => this.setState({showPassword: !this.state.showPassword})}>
                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </InputAdornment>
                            }
                            />
                    </FormControl>
                    {this.state.passwordError && <span className="error-text">Password cannot be empty</span>}
                </Box>

                <Box className="input-box">
                    <CustomButton
                        className={"full " + (this.disabledButton() ? "disabled-btn" : "submit-btn")}
                        disabled={this.disabledButton()}
                        loading={this.state.loading}
                        onClick= {this.handleSubmit}>Sign in</CustomButton>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <span onClick={() => this.setState({modal: true})} className="link">Forgot password</span>
                </Box>
            </Box>
        )
    }
}

export default LoginForm;