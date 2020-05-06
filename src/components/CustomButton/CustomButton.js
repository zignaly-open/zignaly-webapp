import React from 'react';
import style from './CustomButton.module.sass';
import {Button, CircularProgress} from '@material-ui/core';

const CustomButton = (props) => {
    const {loading, children, onClick, disabled, type} = props

    const getType = () => {
        switch(type){
            case "header":
                return style.header
            case "login":
                return style.login
            case "disabled":
                return style.disabled
            default:
                return style.login
        }
    }

    return (
        <Button onClick={onClick} disabled={disabled} className={[style.customButton, getType()].join(" ")}>
            {loading ? <CircularProgress thickness={5} className="loader" /> :  children}
        </Button>
    )
}

export default CustomButton;