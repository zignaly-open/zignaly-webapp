import React, {Component, useState} from 'react';
import './ResetPasswordForm.scss';
import {Box, InputAdornment, IconButton, FormControl, OutlinedInput, Popper} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
import {alertError} from '../../../actions';
import axios from 'axios';
import {RECOVER3_URL,} from '../../../api';
import { validatePassword } from '../../../utils/validators';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PasswordStrength from '../../PasswordStrength';
import {useForm} from 'react-hook-form';

const ResetPasswordForm = (props) => {
    const [anchorEl, setAnchorEl] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [passwordDoNotMatch, setPasswordDoNotMatch] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [strength, setStrength] = useState(0)
    const {errors, handleSubmit, register, watch, clearError} = useForm()

    const handlePasswordChange = (e) => {
        setPasswordDoNotMatch(false)
        setAnchorEl(e.currentTarget)
        let howStrong = validatePassword(e.target.value)
        setStrength(howStrong)
        howStrong >= 4 ? clearError("password") : setError("password")
    }

    const handleRepeatPasswordChange = (e) => {
        setPasswordDoNotMatch(false)
        let howStrong = validatePassword(e.target.value)
        setStrength(howStrong)
        howStrong >= 4 ? clearError("repeatPassword") : setError("repeatPassword")
    }

    const onSubmit = (data) => {
        if(password === repeatPassword){
            console.log(data)
        } else {
            setPasswordDoNotMatch(true)
        }
        requestPasswordChange()
    }

    const requestPasswordChange = (params) => {

    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className="reset-password-form" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <h3>Reset Password From</h3>
                <Popper
                    className="password-strength-box"
                    placement="left"
                    transition
                    open={anchorEl ? true : false}
                    anchorEl={anchorEl}>
                    <PasswordStrength onClose={() => setAnchorEl(undefined)} strength={strength} />
                </Popper>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">New Password</label>
                    <FormControl className="custom-input" variant="outlined">
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            error={errors.password ? true : false}
                            onBlur={() => setAnchorEl(undefined)}
                            inputRef={register(required)}
                            onChange={handlePasswordChange}
                            name="password"
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {howPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }/>
                    </FormControl>
                </Box>

                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Repeat Password</label>
                    <FormControl className="custom-input" variant="outlined">
                        <OutlinedInput
                            type={showRepeatPassword ? 'text' : 'password'}
                            error={errors.repeatPassword ? true : false}
                            onChange={handleRepeatPasswordChange}
                            inputRef={register(required)}
                            name="repeatPassword"
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                                    {showRepeatPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                            }/>
                    </FormControl>
                    {passwordDoNotMatch && <span className="error-text">Passwords do not match</span>}
                </Box>

                <Box className="input-box">
                    <CustomButton
                        type="submit"
                        className={"full submit-btn"}
                        loading={loading}
                        onClick= {handleSubmit}>Sign in</CustomButton>
                </Box>
            </Box>
        </form>
    )
}

export default TwoFAForm;