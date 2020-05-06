import React, {Component} from 'react';
import style from './CustomButton.module.sass';
import {Button, CircularProgress} from '@material-ui/core';

const CustomButton = (props) => {
    const {loading, children, onClick, disabled, type} = props

    const getType = () => {
        switch(type){
            case "green":
                return style.green
            case "purple":
                return style.purple
            case "red":
                return style.red
            case "pink":
                return style.pink
            case "blue":
                return style.pink
            default:
                return style.purple
        }
    }

    return (
        <Button onClick={onClick} disabled={disabled} className={[style.customButton, getType()].join(" ")}>
            {loading ? <CircularProgress thickness={5} className="loader" /> :  children}
        </Button>
    )
}

export default CustomButton;