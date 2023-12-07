//Import Reducer store.
import store from '../../redux/Store/store';

//Import Utils.
import { convertToUTC, getDifferenceInSeconds, getRandomScreenshotTime, getAppConfigs, delay } from '../../utils/functions';

//Import functions related to tracker service.
import { captureScreenshot, captureWebcamshot } from './captureScreenshot';

//Import Constants.
import { WEBCAMSHOT_DELAY } from '../../shared/constants';

//To store set interval instace info.
let timerSetInterval = null;

//Start one second timer for the tracker.
export const startTimer = async () => {
    try {

        //Start the keyboard-mouse events tracking.
        window.tracker.keyboardMouseEvents.startTracking();

        //Redux state.
        const { objUser, inActivityID, strActivityName, inActivityStartTime, inSelectedProjectID, arrAppConfigs, isTodayTimeSummaryExist, inTodayTimeSummaryRowDataID, inTotalActiveTime } = store.getState();

        /*Application configuration [In seconds] */
        const { localDBSyncTime, serverSyncTime, serverImageSyncTime, systemIdleTime, screenshotInterval, isCaptureScreen, isCaptureWebcam } = getAppConfigs(arrAppConfigs);
        let screenshotTime = getRandomScreenshotTime(screenshotInterval);
        let webcamshotTime = screenshotTime + WEBCAMSHOT_DELAY;

        console.group("Application Configurations");
        console.log("localDBSyncTime: " + localDBSyncTime + " , serverSyncTime: " + serverSyncTime + " , systemIdleTime: " + systemIdleTime);
        console.log("screenshotInterval: " + screenshotInterval + ", screenshotTime: " + screenshotTime + " , webcamshotTime: " + webcamshotTime);
        console.log("isCaptureScreen: " + isCaptureScreen + " , isCaptureWebcam: " + isCaptureWebcam);
        console.groupEnd();

        //Object for sync data in the local data.
        let syncActivityRowData = {
            activityRowDataID: null,
            activityID: inActivityID,
            userID: objUser.user_id,
            selectedProjectID: inSelectedProjectID,
            activityName: strActivityName,
            startTime: convertToUTC(new Date(inActivityStartTime)),
            endTime: convertToUTC(new Date(inActivityStartTime)),
            keyboardCount: 0,
            mouseCount: 0,
            trackerStop: 0
        };

        //Creatre interval of 1 second.
        timerSetInterval = setInterval(async () => {
            try {

                //Time in second when last time user has done any activity on keyboard or mouse.
                let lastKeyboardOrMouseEventTime = await window.tracker.keyboardMouseEvents.getLastEventTime();
                lastKeyboardOrMouseEventTime = getDifferenceInSeconds(new Date().getTime(), lastKeyboardOrMouseEventTime);

                //Check for system idle mode, if true then stop the tracker.
                if (lastKeyboardOrMouseEventTime === systemIdleTime) {
                    clearInterval(timerSetInterval);
                    store.dispatch({ type: 'STOP_TRACKER', payload: { inActivityEndTime: new Date().getTime(), inTrackerStop: 2 } });
                    return;
                }

                //Timer time in second.
                let timerCount = getDifferenceInSeconds(new Date().getTime(), inActivityStartTime);
                console.log("Timer Count: " + timerCount);

                //Specific interval sync data in local db.
                if (timerCount !== 0 && timerCount % localDBSyncTime === 0) {

                    //Update end time.
                    syncActivityRowData.endTime = convertToUTC(new Date());

                    //Update activtiy name.
                    syncActivityRowData.activityName = store.getState().strActivityName;

                    //Update keyboard and mouse count.
                    const { keyboardCounts, mouseCounts } = await window.tracker.keyboardMouseEvents.getCounts();
                    syncActivityRowData.keyboardCount = keyboardCounts;
                    syncActivityRowData.mouseCount = mouseCounts;

                    //Sync data to local db.
                    await window.tracker.db.syncActivityRowData("ACTIVITY_UPDATE", syncActivityRowData);

                    //Update user total active time in local db.
                    await window.tracker.db.updateUserTodayTimeSummary(inTodayTimeSummaryRowDataID, inTotalActiveTime + timerCount);

                }

                //Specific interval sync data server and create new sub activity data in local db.
                if (timerCount !== 0 && timerCount % serverSyncTime === 0) {

                    //Update start and end time.
                    syncActivityRowData.startTime = syncActivityRowData.endTime;

                    //Update activtiy name.
                    syncActivityRowData.activityName = store.getState().strActivityName;

                    //Reset keyboard and mouse counts new sub activity.
                    syncActivityRowData.keyboardCount = 0;
                    syncActivityRowData.mouseCount = 0;
                    window.tracker.keyboardMouseEvents.resetCounts();

                    //get old activity id to sync with server.
                    const oldActivityRowDataID = syncActivityRowData.activityRowDataID;

                    //Start new sub activity data to local db.
                    syncActivityRowData.activityRowDataID = await window.tracker.db.syncActivityRowData("ACTIVITY_START", syncActivityRowData);

                    //Dispatch event to update activitiy row data id.
                    store.dispatch({ type: 'UPDATE_ACTIVITY_ROW_DATA_ID', payload: syncActivityRowData.activityRowDataID });

                    //Sync activity row data to server.
                    store.dispatch({ type: 'SINGLE_ROW_DATA_SYNC_SERVER_REQUESTED', payload: { id: oldActivityRowDataID } });

                }

                if (timerCount === screenshotTime && isCaptureScreen) {

                    //Capture screenshot.
                    captureScreenshot(syncActivityRowData);

                    //Get new random time to capture screenshot.
                    screenshotTime = getRandomScreenshotTime(screenshotInterval);
                    screenshotTime += timerCount;
                    console.log("Update screenshotTime: " + screenshotTime);

                }

                if (timerCount === webcamshotTime && isCaptureWebcam) {

                    //Capture webcamshot.
                    captureWebcamshot(syncActivityRowData);

                    //Get new random time to capture webcamshot.
                    webcamshotTime = screenshotTime + WEBCAMSHOT_DELAY;
                    console.log("Update webcamshotTime: " + webcamshotTime);

                }

                //At specific interval Sync activity images to the server.
                if (timerCount !== 0 && timerCount % serverImageSyncTime === 0) {
                    store.dispatch({ type: 'BULK_IMAGES_DATA_SYNC_SERVER_REQUESTED', payload: { syncType: "CURRENT_SESSION_IMAGES", id: inActivityID } });
                }

            } catch (error) {

                store.dispatch({
                    type: 'ERROR_HANDLER_POPUP_REQUESTED',
                    payload: {
                        strErrorHandlerPopup: 'show',
                        objErrorHandler: { strFunction: 'Timer Loop', strMessage: error.message, inCriticality: 2 }
                    }
                });

            }

        }, 1000);

        //When new activty start, add inital data into local db.
        syncActivityRowData.activityRowDataID = await window.tracker.db.syncActivityRowData("ACTIVITY_START", syncActivityRowData);

        if (!isTodayTimeSummaryExist) {

            const todayTimeSummarydata = {
                userID: objUser.user_id,
                summaryDate: new Date().toLocaleDateString(),
                dayStartTime: inActivityStartTime,
                totalActiveTime: 0,
            }

            //If today time summary not found,add inital data into local db.
            const todayTimeSummaryRowDataID = await window.tracker.db.saveUserTodayTimeSummary(todayTimeSummarydata);

            //Dispatch event to update today time summary data.
            store.dispatch({
                type: 'UPDATE_TODAY_TIME_SUMMARY_DATA',
                payload: {
                    todayTimeSummaryRowDataID: todayTimeSummaryRowDataID,
                    dayStartTime: inActivityStartTime,
                    totalActiveTime: 0
                }
            });

        }

        //Dispatch event to update activitiy row data id.
        store.dispatch({ type: 'UPDATE_ACTIVITY_ROW_DATA_ID', payload: syncActivityRowData.activityRowDataID });

    } catch (error) {

        store.dispatch({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'startTimer()', strMessage: error.message, inCriticality: 2 }
            }
        });

    }

}

//Stop tracker timer.
export const stopTimer = async (actionPayload) => {
    try {

        //Clear interval to stop timer.
        clearInterval(timerSetInterval);

        //Redux state.
        const { inActivityID, inActivityRowDataID, strActivityName, inActivityStartTime, inTodayTimeSummaryRowDataID, inTotalActiveTime, } = store.getState();

        //Object for sync data in the local data.
        let syncActivityRowData = {
            activityRowDataID: inActivityRowDataID,
            activityName: strActivityName,
            endTime: convertToUTC(new Date(actionPayload.inActivityEndTime)),
            trackerStop: actionPayload.inTrackerStop
        }

        //Update keyboard and mouse count and stop the keyboard-mouse events tracking.
        const { keyboardCounts, mouseCounts } = await window.tracker.keyboardMouseEvents.getCounts();
        syncActivityRowData.keyboardCount = keyboardCounts;
        syncActivityRowData.mouseCount = mouseCounts;
        window.tracker.keyboardMouseEvents.stopTracking();

        if (inActivityRowDataID) {

            //Sync data to local db.
            await window.tracker.db.syncActivityRowData("ACTIVITY_UPDATE", syncActivityRowData);

            //Dispatch event to update activitiy row data id.
            store.dispatch({ type: 'UPDATE_ACTIVITY_ROW_DATA_ID', payload: null });

            //Update user total active time in local db.
            const totalActiveTime = inTotalActiveTime + getDifferenceInSeconds(actionPayload.inActivityEndTime, inActivityStartTime);
            await window.tracker.db.updateUserTodayTimeSummary(inTodayTimeSummaryRowDataID, totalActiveTime);

            //Update total active time in redux.
            store.dispatch({ type: 'UPDATE_TOTAL_ACTIVE_TIME', payload: { totalActiveTime: totalActiveTime } });

            //Sync activity row data to server.
            store.dispatch({ type: 'SINGLE_ROW_DATA_SYNC_SERVER_REQUESTED', payload: { id: inActivityRowDataID } });

            //Add 5 second delay. 
            await delay(5000);

            //Sync activity images to the server.
            store.dispatch({ type: 'BULK_IMAGES_DATA_SYNC_SERVER_REQUESTED', payload: { syncType: "CURRENT_SESSION_IMAGES", id: inActivityID } });

        }

    } catch (error) {

        store.dispatch({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'stopTimer()', strMessage: error.message, inCriticality: 2 }
            }
        });

    }
}