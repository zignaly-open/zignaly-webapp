import React from 'react';
import './Modal.sass';
import { Dialog } from '@material-ui/core';

const GenericModal = (props) => {
    const {state, onClose, persist, children, className} = props

    return (
        <Dialog
            open={state}
            onClose={onClose}
            classes={{paper: 'modal ' + (className ? className : "")}}
            disableBackdropClick={persist}>

            {children}
        </Dialog>
    )
}

export default GenericModal;