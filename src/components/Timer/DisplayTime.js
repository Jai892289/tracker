import React, { useState, useEffect } from 'react';

//Import Material UI Components.
import Typography from '@material-ui/core/Typography';

//Import Utils.
import { calculateTime } from '../../utils/functions';

const DisplayTime = (props) => {

    //Component States.
    const renderComponent = useState(false);

    //Set second second interval to update component at every one second.
    useEffect(() => {
        let id = setInterval(() => {
            renderComponent[1](new Date().getTime());
        }, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line
    }, []);

    //Call function for calculate time to display timer.
    const displayTime = calculateTime(props.inActivityStartTime);

    return (
        <Typography
            variant="subtitle1"
        >
            {displayTime}
        </Typography>
    )
}

export default DisplayTime;