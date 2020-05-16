import React from 'react';
import './Modal.scss';
import { Dialog } from '@material-ui/core';

const GenericModal = (props) => {
    const {state, onClose, persist, children, size} = props

    return (
        <Dialog
            open={state}
            onClose={onClose}
            maxWidth="lg"
            classes={{paper: 'modal ' + (size ? size : " ")}}
            disableBackdropClick={persist}>

            {children}
        </Dialog>
    )
}

export default GenericModal;