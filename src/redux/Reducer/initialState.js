const initialState = {
    isFullScreenLoader: false,
    isSingleRowDataSyncing: false,
    isBulkRowDataSyncing: false,
    isBulkImagesDataSyncing: false,
    isFirstTimeSignin: true,
    isOfflineSignin: false,
    isSystemOnline: navigator.onLine,
    strUserSignoutPopup: "hide",
    objNotification: {
        type: "none",
        message: ""
    },
    objUser: {},
    arrUserProjects: [{ id: 1, name: "Default Project" }],
    arrAppConfigs: [
        {
            name: "Webcamshot",
            value: "yes"
        },
        {
            name: "Screenshot",
            value: "yes"
        },
        {
            name: "Keyboard and Mouse Tracing",
            value: "yes"
        },
        {
            name: "Manual Entry Allowed",
            value: "yes"
        },
        {
            name: "Daily Report",
            value: "no"
        },
        {
            name: "Idle Time",
            value: "10"
        },
        {
            name: "Sync Time",
            value: "10"
        },
        {
            name: "Screenshot Interval",
            value: "5"
        }
    ],

    //Activity related
    isTrackerStart: false,
    inActivityRowDataID: null,
    inActivityID: null,
    inActivityStartTime: null,
    strActivityRunTime: '00:00:00',
    strActivityName: 'Default Activity',
    inSelectedProjectID: null,
    strActivityNamePopup: "hide",
    inLastRowDataSync: null,

    strErrorHandlerPopup: "hide",
    objErrorHandler: {
        strFunction: "",
        strMessage: "",
        inCriticality: null
    },

    //Time summary state
    isTodayTimeSummaryExist : false,
    inTodayTimeSummaryRowDataID: null,
    inDayStartTime : null,
    inTotalActiveTime: 0 //in seconds

};

export default initialState;