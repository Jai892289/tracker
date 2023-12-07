import initialState from './initialState';

//Import Utils.
import { calculateTime } from '../../utils/functions';

const reducer = (state = initialState, action = {}) => {

    switch (action.type) {
        case "SET_NOTIFICATION_MESSAGE":
            state = {
                ...state,
                objNotification: action.objNotification
            };
            break;
        case "USER_SIGNIN_REQUESTED":
            state = {
                ...state,
                isFullScreenLoader: true,
            };
            break;
        case "USER_SIGNIN_SUCCEEDED":
            state = {
                ...state,
                isFirstTimeSignin: false,
                isOfflineSignin: false,
                objUser: action.objUser
            };
            break;
        case "APP_CONFIG_SUCCEEDED":
            state = {
                ...state,
                isFullScreenLoader: false,
                arrAppConfigs: action.arrAppConfigs
            };
            break;
        case "USER_SIGNIN_FAILED":
        case "APP_CONFIG_FAILED":
            state = {
                ...state,
                isFullScreenLoader: false,
                objNotification: action.objNotification
            };
            break;
        case "PROJECT_LIST_SUCCEEDED":
            state = {
                ...state,
                arrUserProjects: action.arrUserProjects
            };
            break;
        case "USER_OFFLINE_SIGNIN_REQUESTED":
            state = {
                ...state,
                isFirstTimeSignin: false,
                isOfflineSignin: true,
                objUser: action.objUser,
                arrUserProjects: action.arrUserProjects ? action.arrUserProjects : initialState.arrUserProjects,
                arrAppConfigs: action.arrAppConfigs ? action.arrAppConfigs : initialState.arrAppConfigs
            };
            break;
        case "USER_SIGNOUT_POPUP_REQUESTED":
            state = {
                ...state,
                strUserSignoutPopup: action.strUserSignoutPopup
            };
            break;
        case "USER_SIGNOUT_REQUESTED":
            state = {
                ...state,
                isFullScreenLoader: true,
                strUserSignoutPopup: "hide"
            }
            break;
        case "USER_SIGNOUT_SUCCEEDED":
            state = {
                ...state,
                objUser: {},
                isFullScreenLoader: false,
                inActivityID: null,
                inActivityStartTime: null,
                strActivityRunTime: '00:00:00',
                strActivityName: 'Default Activity',
                inSelectedProjectID: null,
                inLastRowDataSync: initialState.inLastRowDataSync,
                isTodayTimeSummaryExist : initialState.isTodayTimeSummaryExist,
                inTodayTimeSummaryRowDataID: initialState.inTodayTimeSummaryRowDataID,
                inDayStartTime : initialState.inDayStartTime,
                inTotalActiveTime: initialState.inTotalActiveTime,
            };
            break;
        case "UPDATE_INTERNET_STATUS":
            state = {
                ...state,
                isSystemOnline: action.payload
            };
            break;
        case "START_TRACKER":
            state = {
                ...state,
                isTrackerStart: true,
                inActivityID: action.payload.inActivityID,
                inActivityStartTime: action.payload.inActivityStartTime
            };
            break;
        case "STOP_TRACKER":
            state = {
                ...state,
                isTrackerStart: false,
                strActivityRunTime: calculateTime(state.inActivityStartTime)
            };
            break;
        case "ACTIVITY_NAME_POPUP":
            state = {
                ...state,
                strActivityNamePopup: action.payload.strActivityNamePopup,
                strActivityName: action.payload.strActivityName || initialState.strActivityName
            };
            break;
        case "UPDATE_ACTIVITY_ROW_DATA_ID":
            state = {
                ...state,
                inActivityRowDataID: action.payload
            };
            break;
        case "UPDATE_SELECTED_PROJECT_ID":
            state = {
                ...state,
                inSelectedProjectID: action.payload
            };
            break;
        case "SINGLE_ROW_DATA_SYNC_SERVER_REQUESTED":
            state = {
                ...state,
                isSingleRowDataSyncing: true
            };
            break;
        case "SINGLE_ROW_DATA_SYNC_SERVER_COMPLETED":
            state = {
                ...state,
                isSingleRowDataSyncing: false,
                inLastRowDataSync : new Date().getTime()
            };
            break;
        case "BULK_ROW_DATA_SYNC_SERVER_REQUESTED":
            state = {
                ...state,
                isBulkRowDataSyncing: true
            };
            break;
        case "BULK_ROW_DATA_SYNC_SERVER_COMPLETED":
            state = {
                ...state,
                isBulkRowDataSyncing: false,
                inLastRowDataSync : new Date().getTime()
            };
            break;
        case "BULK_IMAGES_DATA_SYNC_SERVER_REQUESTED":
            state = {
                ...state,
                isBulkImagesDataSyncing: true
            };
            break;
        case "BULK_IMAGES_DATA_SYNC_SERVER_COMPLETED":
            state = {
                ...state,
                isBulkImagesDataSyncing: false
            };
            break;
        case "START_FULL_SCREEN_LOADER":
            state = {
                ...state,
                isFullScreenLoader: true
            };
            break;
        case "ERROR_HANDLER_POPUP_REQUESTED":
            state = {
                ...state,
                strErrorHandlerPopup: action.payload.strErrorHandlerPopup,
                objErrorHandler: action.payload.objErrorHandler
            };
            break;
        case "SEND_ERROR_REPORT_To_SERVER_REQUESTED":
            state = {
                ...state,
                strErrorHandlerPopup: "hide",
                objErrorHandler: initialState.objErrorHandler
            };
            break;
        case "UPDATE_TODAY_TIME_SUMMARY_DATA":
            state = {
                ...state,
                isTodayTimeSummaryExist: true,
                inTodayTimeSummaryRowDataID: action.payload.todayTimeSummaryRowDataID,
                inDayStartTime: action.payload.dayStartTime,
                inTotalActiveTime: action.payload.totalActiveTime
            };
            break;
        case "UPDATE_TOTAL_ACTIVE_TIME":
            state = {
                ...state,
                inTotalActiveTime: action.payload.totalActiveTime
            };
            break;
        default:

    }
    return state;
};

export default reducer;