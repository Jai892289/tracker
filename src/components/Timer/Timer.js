import React from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Typography from '@material-ui/core/Typography';

//Import Custom Components.
import DisplayTime from './DisplayTime';

const Timer = () => {

    //Reducer States.
    const isTrackerStart = useSelector(state => state.isTrackerStart);
    const inActivityStartTime = useSelector(state => state.inActivityStartTime);
    const strActivityRunTime = useSelector(state => state.strActivityRunTime);
    return (
        <div className="timer">
            {isTrackerStart
                ? <DisplayTime
                    inActivityStartTime={inActivityStartTime}
                />
                : <Typography
                    variant="subtitle1"
                >
                    {strActivityRunTime}
                </Typography>
            }
        </div>
    )
}

export default Timer;