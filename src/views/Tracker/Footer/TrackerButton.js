import React from 'react';

//Import Redux releated function.
import { useSelector, useDispatch } from 'react-redux';

//Import Material UI Components.
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const TrackerButton = () => {

    //Reducer States.
    const dispatch = useDispatch();
    const isTrackerStart = useSelector(state => state.isTrackerStart);
    const objUser = useSelector(state => state.objUser);

    //Handle tracker start/stop event.
    const handleClick = () => {
        let dispatchAction = !isTrackerStart ? 'START_TRACKER' : 'STOP_TRACKER';
        let dispatchPayload = !isTrackerStart ?
            {
                inActivityID: objUser.user_id * new Date().getTime(),
                inActivityStartTime: new Date().getTime()
            } :
            {
                inActivityEndTime: new Date().getTime(),
                inTrackerStop: 1
            }

        //Dispatch event to start/stop tracker.
        dispatch({ type: dispatchAction, payload: dispatchPayload });
    }

    return (
        <Grid container>
            <Grid item xs={12}>
                <div className="tracker-button-component">
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        className={!isTrackerStart ? `start-button` : `stop-button`}
                        size="large"
                        onClick={handleClick}
                    >
                        {!isTrackerStart ? `Start Tracking` : ` Stop Tracking`}
                    </Button>
                </div>
            </Grid>
        </Grid >
    )
}

export default TrackerButton;