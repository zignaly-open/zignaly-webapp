import React, { useState } from 'react';
import './Alert.scss';
import {Snackbar} from '@material-ui/core';
import Message from './Message';

const Popup = () => {
    const [alert, showAlert] = useState(false)

    return (
        <Snackbar
            anchorOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            className={"alert success"}
            open={alert}
            onClose={() => showAlert(true)}
            autoHideDuration={5000}>

            <Message data={{}} />

        </Snackbar>
    )
}

export default Popup;