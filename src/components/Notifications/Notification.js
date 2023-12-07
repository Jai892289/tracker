import React from 'react';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux'

//Import Custom Components.
import AlertSnackbar from '../Notifications/AlertSnackbar';

function Notification() {

    const objNotification = useSelector(state => state.objNotification);
    const dispatch = useDispatch()

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        //Reset Notification.
        dispatch({ type: 'SET_NOTIFICATION_MESSAGE', objNotification: { type: "none", message: "" } });
    };

    return (
        <div>
            {objNotification.type !== "none" &&
                <AlertSnackbar
                    isOpen={objNotification.type !== "none" ? true : false}
                    severity={objNotification.type}
                    position="top"
                    handleClose={handleClose}
                >
                    {objNotification.message}
                </AlertSnackbar>
            }
        </div>
    );
}

export default Notification;