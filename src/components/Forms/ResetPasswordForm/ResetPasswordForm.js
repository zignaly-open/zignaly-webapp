import React, {Component} from 'react';
import './ResetPasswordForm.sass';
import {Box, InputAdornment, IconButton, FormControl, OutlinedInput, Popper} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
import {alertError} from '../../../actions';
import axios from 'axios';
import {RECOVER3_URL,} from '../../../api';
import { validatePassword } from '../../../helpers/validators';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PasswordStrength from '../../PasswordStrength';

class TwoFAForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            password: "",
            passwordError: false,
            repeatPassword: "",
            repeatPasswordError: false,
            loading: false,
            showPassword: false,
            showRepeatPassword: false,
            strength: 0,
            anchorEl: undefined,
        }
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
            passwordError: validatePassword(e.target.value) >= 4 ? false : true,
            anchorEl: e.currentTarget,
            strength: validatePassword(e.target.value)
        })
    }

    handleRepeatPasswordChange = (e) => {
        this.setState({
            repeatPassword: e.target.value,
            repeatPasswordError: validatePassword(e.target.value) >= 4 && e.target.value === this.state.password ? false : true,
            anchorEl: e.currentTarget,
            strength: validatePassword(e.target.value)
        })
    }

    handleSubmit = () => {
        const params = {
            password: this.state.password,
            token: this.props.token,
        }
        this.requestPasswordChange(params)
    }

    requestPasswordChange = (params) => {
        axios.post(RECOVER3_URL, params)
            .then(() => {
                this.props.onSuccess()
            })
            .catch((err) => {
                this.props.dispatch(alertError(err.response.data.error.msg))
            })
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
        if(this.state.password && this.state.repeatPassword && this.props.token){
            if(!this.state.passwordError && !this.state.repeatPasswordError){
                return false
            }
            return true
        }
        return true
    }

    render(){
        return(
            <Box className="reset-password-form" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <h3>Reset Password From</h3>
                <Popper
                    className="password-strength-box"
                    placement="left"
                    transition
                    open={this.state.anchorEl ? true : false}
                    anchorEl={this.state.anchorEl}>
                    <PasswordStrength onClose={() => this.setState({anchorEl: undefined})} strength={this.state.strength} />
                </Popper>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">New Password</label>
                    <FormControl className="custom-input" variant="outlined">
                        <OutlinedInput
                            type={this.state.showPassword ? 'text' : 'password'}
                            value={this.state.password}
                            error={this.state.passwordError}
                            onBlur={() => this.setState({anchorEl: undefined})}
                            onChange={this.handlePasswordChange}
                            onKeyDown={this.handleKeyPress}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => this.setState({showPassword: !this.state.showPassword})}>
                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }/>
                    </FormControl>
                </Box>

                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Repeat Password</label>
                    <FormControl className="custom-input" variant="outlined">
                        <OutlinedInput
                            type={this.state.showRepeatPassword ? 'text' : 'password'}
                            value={this.state.repeatPassword}
                            error={this.state.repeatPasswordError}
                            onBlur={() => this.setState({anchorEl: undefined})}
                            onChange={this.handleRepeatPasswordChange}
                            onKeyDown={this.handleKeyPress}
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => this.setState({showRepeatPassword: !this.state.showRepeatPassword})}>
                                    {this.state.showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }/>
                    </FormControl>
                    {this.state.repeatPasswordError && <span className="error-text">Passwords do not match</span>}
                </Box>

                <Box className="input-box">
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