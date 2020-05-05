import React, {Component} from 'react';
import './Modal.sass';
import { Dialog } from '@material-ui/core';

class GenericModal extends Component {
    render(){
        const {state, onClose, persist, children} = this.props

        return (
            <Dialog
                open={state}
                onClose={onClose}
                classes={{paper: 'modal ' + (this.props.className ? this.props.className : "")}}
                disableBackdropClick={persist}>

                {children}
            </Dialog>
        )
    }
}

export default GenericModal;