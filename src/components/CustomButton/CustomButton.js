import React from 'react';
import './CustomButton.sass';
import {Button, CircularProgress} from '@material-ui/core';

const CustomButton = (props) => {
    const {loading, className, children, onClick, disabled, type} = props

    return (
        <Button type={type ? type : "button"} onClick={onClick} disabled={disabled} className={"customButton " + className}>
            {loading ? <CircularProgress thickness={5} className="loader" /> :  children}
        </Button>
    )
}

export default CustomButton;