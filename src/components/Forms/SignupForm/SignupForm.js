import React, {Component} from 'react';
import './SignupForm.sass';
import common from '../../../styles/common.module.sass';
import {Box, TextField, Checkbox, IconButton, InputAdornment, FormControl, OutlinedInput, Popper} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
import {validateEmail, validateName, validatePassword} from '../../../helpers/validators';
// import ReCAPTCHA from "react-google-recaptcha";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PasswordStrength from '../../PasswordStrength';

class LoginForm extends Component{
    constructor(props){
        super(props)
        this.state = {
            name: "",
            email: "",
            password: "",
            repeat_password: "",
            terms: false,
            termsError: false,
            nameError: false,
            emailError: false,
            loading: false,
            gRecaptchaResponse: "",
            ref: "",
            showPassword: false,
            showRepeatPassword: false,
            anchorEl: undefined,
            strength: 0,
            subscribe: true,
            passwordDoNotMatch: false,
            passwordError: false,
            repeatPasswordError: false
        }
        this.recaptchaRef = React.createRef();
    }

    // componentDidMount() {
    //     const ref = saveRefCookie(this.props.location);
    //     this.setState({ref: ref})
    // }

    handleEmailChange = (e) => {
        this.setState({
            email: e.target.value,
            emailError: validateEmail(e.target.value) ? false : true
        })
    }

    handleNameChange = (e) => {
        this.setState({
            name: e.target.value,
            nameError: validateName(e.target.value) ? false : true
        })
    }

    handleTermsChange = (e) => {
        this.setState({
            terms: e.target.checked,
            termsError: e.target.checked ? false : true
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
            anchorEl: e.currentTarget,
            strength: validatePassword(e.target.value),
            passwordDoNotMatch: false,
            passwordError:  e.target.value && validatePassword(e.target.value) >= 4 ? false : true
        })
    }

    handleRepeatPasswordChange = (e) => {
        this.setState({
            repeat_password: e.target.value,
            strength: validatePassword(e.target.value),
            passwordDoNotMatch: false,
            repeatPasswordError:  e.target.value && e.target.value.length >= 3 ? false : true
        })
    }

    matchPasswords = () => {
        this.setState({anchorEl: undefined})
        if(this.state.password && this.state.repeat_password){
            if(this.state.password === this.state.repeat_password){
                this.setState({passwordDoNotMatch: false})
            } else {
                this.setState({passwordDoNotMatch: true})
            }
        } else {
            this.setState({passwordDoNotMatch: false})
        }
    }

    showLoader = () => {
        this.setState({loading: true})
    }

    hideLoader = () => {
        this.setState({loading: false})
    }

    handleSubmit = () => {
        if(this.state.terms){
            this.showLoader()
            const params = {
                projectId: projectId,
                firstName: this.state.name,
                email: this.state.email,
                password: this.state.password,
                subscribe: this.state.subscribe,
                ref: this.state.ref || null,
                array: true,
                gRecaptchaResponse: "abracadabra"
            };
            if(envconfig.configureCaptcha){
                this.recaptchaRef.current.reset()
            }
            this.setState({gRecaptchaResponse: ''})
            this.props.dispatch(signup(params, this.hideLoader));
        } else{
            this.setState({termsError: true})
        }
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.handleSubmit()
        }
    }

    disabledButton = () => {
        if(this.state.name && this.state.email && this.state.password && this.state.repeat_password){
            if(!this.state.emailError && !this.state.nameError && !this.state.passwordError && !this.state.repeatPasswordError && !this.state.passwordDoNotMatch){
                return false
            }
            return true
        }
        return true
    }

    onChangeReCAPTCHA = (value) => {
        this.setState({gRecaptchaResponse: value})
    }

    onExpiredReCAPTCHA = () => {
        this.props.dispatch(alertError('Your solution to the ReCAPTCHA has expired, please resolve it again.'));
        this.setState({gRecaptchaResponse: ''})
    }

    onErroredReCAPTCHA = () => {
        this.props.dispatch(alertError('Something went wrong with the ReCAPTCHA, try to reload the page if you can\'t signup.'));
        this.setState({gRecaptchaResponse: ''})
    }

    render(){
        return(
            <Box className="signup-form" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Popper
                    className={common.passwordStrengthBox}
                    placement="left"
                    transition
                    open={this.state.anchorEl ? true : false}
                    anchorEl={this.state.anchorEl}>
                    <PasswordStrength onClose={() => this.setState({anchorEl: undefined})} strength={this.state.strength} />
                </Popper>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className={common.customLabel}>Name</label>
                    <TextField
                        className={common.customInput}
                        fullWidth
                        type="text"
                        variant="outlined"
                        error={this.state.nameError}
                        value={this.state.name}
                        onChange={this.handleNameChange}
                        onKeyDown={this.handleKeyPress}
                        />
                </Box>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className={common.customLabel}>Email address</label>
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
                    <label className={common.customLabel}>Password</label>
                    <FormControl className={common.customInput} variant="outlined">
                        <OutlinedInput
                            type={this.state.showPassword ? 'text' : 'password'}
                            value={this.state.password}
                            error={this.state.passwordError}
                            onBlur={this.matchPasswords}
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
                </Box>

                <Box className={"input-box " + (this.state.passwordDoNotMatch ? "no-margin" : "")} display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className={common.customLabel}>Repeat Password</label>
                    <FormControl className={common.customInput} variant="outlined">
                        <OutlinedInput
                            type={this.state.showRepeatPassword ? 'text' : 'password'}
                            value={this.state.repeatPassword}
                            error={this.state.repeatPasswordError}
                            onBlur={this.matchPasswords}
                            onChange={this.handleRepeatPasswordChange}
                            onKeyDown={this.handleKeyPress}
                            endAdornment={
                                <InputAdornment position="end">
                                    <span className={common.pointer} onClick={() => this.setState({showRepeatPassword: !this.state.showRepeatPassword})}>
                                        {this.state.showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </InputAdornment>
                            }
                            />
                    </FormControl>
                </Box>
                <Box minWidth="100%" display="flex" flexDirection="row" justifyContent="center">
                    {this.state.passwordDoNotMatch && <span className="error-text bold">Passwords do not match!</span>}
                </Box>
                <Box className="input-box checkbox">
                    <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start">
                        <Checkbox
                            checked={this.state.terms}
                            className={common.checkboxInput + (this.state.termsError ? "error" : "")}
                            onChange={this.handleTermsChange}
                        />
                        <Box className="terms-box" display="flex" flexDirection="row" justifyContent="start" flexWrap="wrap">
                            <span className="text">I agree to</span>
                            <a href={`/legal/terms`} className="link">Terms and condition</a>
                            <span className="text">and</span>
                            <a href={`/legal/privacy`} className="link">privacy policy</a>
                        </Box>
                    </Box>
                </Box>

                <Box className="input-box checkbox">
                    <Box display="flex" flexDirection="row" justifyContent="start" alignItems="start">
                        <Checkbox
                            checked={this.state.subscribe}
                            className={common.checkboxInput}
                            onChange={(e) => this.setState({subscribe: e.target.checked})}
                        />
                        <span className={"terms-text"}>Subscribe to notifications</span>
                    </Box>
                </Box>

                {/* {envconfig.configureCaptcha &&
                    <Box className="input-box">
                        <ReCAPTCHA
                            ref={this.recaptchaRef}
                            sitekey="6LdORtMUAAAAAGLmbf3TM8plIRorVCEc9pVChix8"
                            onChange={this.onChangeReCAPTCHA}
                            onExpired={this.onExpiredReCAPTCHA}
                            onErrored={this.onErroredReCAPTCHA}/>
                    </Box>
                } */}

                <Box className="input-box button-box">
                    <CustomButton
                        className={"full " + (this.disabledButton() ? "disabled-btn" : "submit-btn")}
                        disabled={this.disabledButton()}
                        loading={this.state.loading}
                        onClick= {this.handleSubmit}>Register</CustomButton>
                </Box>
            </Box>
        )
    }
}

export default LoginForm;