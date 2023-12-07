import React, { useState, useEffect } from 'react';

//Import Redux releated function.
import { useSelector } from 'react-redux';

//Import Material UI Components.
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

//Import Utils.
import { calculateTime, secondToTimeFormateV1, getDifferenceInSeconds } from '../../../utils/functions';

const TodayTimeSummary = () => {

    //Reducer States.
    const isTrackerStart = useSelector(state => state.isTrackerStart);
    const inActivityStartTime = useSelector(state => state.inActivityStartTime);
    const inDayStartTime = useSelector(state => state.inDayStartTime);
    const inTotalActiveTime = useSelector(state => state.inTotalActiveTime);

    //Component States.
    const [totalTodayTime, setTotalTodayTime] = useState(calculateTime(inDayStartTime));
    const [totalActiveTime, setTotalActiveTime] = useState(secondToTimeFormateV1(inTotalActiveTime));
    const totalIdleTimeInSecond = inDayStartTime ? getDifferenceInSeconds(new Date().getTime(), inDayStartTime) - inTotalActiveTime : 0;
    const [totalIdleTime, setTotalIdleTime] = useState(secondToTimeFormateV1(totalIdleTimeInSecond));

    //Fix: Update total active time, when user login into system after starting the application.
    useEffect(() => {
        setTotalActiveTime(secondToTimeFormateV1(inTotalActiveTime));
        // eslint-disable-next-line
    }, [inTotalActiveTime]);

    //Set second second interval to update component at every one second.
    useEffect(() => {
        let id = setInterval(() => {
            //calculate total today time of user by finding difference between current time and time when user first start tracker.
            setTotalTodayTime(calculateTime(inDayStartTime));
            if (isTrackerStart) {
                //calculate total today active time of user by Addition of active time store in db with time spend by user on current activity.   
                const totalActiveTimeInSecond = inTotalActiveTime + getDifferenceInSeconds(new Date().getTime(), inActivityStartTime);
                setTotalActiveTime(secondToTimeFormateV1(totalActiveTimeInSecond));
            } else {
                //calculate total today idle time of user by removing of active time from the total time.
                const totalIdleTimeInSecond = inDayStartTime ? getDifferenceInSeconds(new Date().getTime(), inDayStartTime) - inTotalActiveTime : 0;
                setTotalIdleTime(secondToTimeFormateV1(totalIdleTimeInSecond));
            }
        }, 1000);
        return () => clearInterval(id);
        // eslint-disable-next-line
    }, [isTrackerStart, inActivityStartTime, inDayStartTime, inTotalActiveTime]);


    return (
        <div className="today-time-summary-component">
            <Grid container>
                <Grid item xs={12} className="total-time">
                    <Typography variant="body2">
                        Total Today Time
                    </Typography>
                    <Typography variant="h6" >
                        <b>{totalTodayTime}</b>
                    </Typography>
                </Grid>
                <Grid item xs={6} className="active-time">
                    <Typography variant="body2" >
                    <b>{totalActiveTime}</b>
                    </Typography>
                    <Typography variant="caption" >
                        Active Time
                    </Typography>
                </Grid>
                <Grid item xs={6} className="idle-time">
                    <Typography variant="body2" >
                    <b>{totalIdleTime}</b>
                    </Typography>
                    <Typography variant="caption" >
                        Idle Time
                    </Typography>
                </Grid>
            </Grid>
            <Divider />
        </div>
    )
}

export default TodayTimeSummary;