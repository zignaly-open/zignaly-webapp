import React, {Component} from 'react';
import './CustomButton.sass';
import {Button, CircularProgress} from '@material-ui/core';

class CustomButton extends Component{
    render(){
        const {loading, className, children, onClick, disabled} = this.props
        return (
            <Button onClick={onClick} disabled={disabled} className={"custom-button " + className}>
                {loading ? <CircularProgress thickness={5} className="loader" /> :  children}
            </Button>
        )
    }
}

export default CustomButton;