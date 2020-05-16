import React, {useState} from 'react';
import './LoginForm.scss';
import common from '../../../styles/common.module.scss';
import {Box, TextField, FormControl, InputAdornment, OutlinedInput} from '@material-ui/core';
import CustomButton from '../../CustomButton/CustomButton';
import Modal from '../../Modal';
import ForgotPasswordForm from '../ForgotPasswordForm';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { useForm } from 'react-hook-form';

const LoginForm = (props) => {
    const [modal, showModal] = useState(false)
    const [loading, showLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const {handleSubmit, errors, register} = useForm()

    const onSubmit = (data) => {
        showLoading(true)
        console.log(data)
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box className="loginForm" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Modal state={modal} size="small" onClose={() => showModal(false)} persist={false}>
                    <ForgotPasswordForm />
                </Modal>
                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Email address</label>
                    <TextField
                        className={common.customInput}
                        type="email"
                        name="email"
                        fullWidth
                        variant="outlined"
                        inputRef={register({ required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ })}
                        error={errors.email ? true : false}
                        />
                    {errors.email && <span className="error-text">Email should be valid</span>}
                </Box>

                <Box className="input-box" display="flex" flexDirection="column" justifyContent="start" alignItems="start">
                    <label className="custom-label">Password</label>
                    <FormControl className={common.customInput} variant="outlined">
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            inputRef={register({ required: true })}
                            error={errors.password ? true : false}
                            name="password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <span className={common.pointer} onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </InputAdornment>
                            }
                            />
                    </FormControl>
                    {errors.password&& <span className="error-text">Password cannot be empty</span>}
                </Box>

                <Box className="input-box">
                    <CustomButton
                        type="submit"
                        className={"full submit-btn"}
                        loading={loading}
                        onClick= {handleSubmit}>Sign in</CustomButton>
                </Box>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <span onClick={() => showModal(true)} className="link">Forgot password</span>
                </Box>
            </Box>
        </form>
    )
}

export default LoginForm;