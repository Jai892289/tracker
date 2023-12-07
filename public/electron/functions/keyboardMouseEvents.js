//List of function to tracke keyboard and mouse events using ipcRenderer.

//Import class.
const { ipcRenderer } = require('electron');

//Start tracking events of keyboard and mouse.
const startTracking = () => {
    return ipcRenderer.invoke('keyboard-mouse-events', "START_EVENT_TRACKING");
}

//Stop tracking events of keyboard and mouse.
const stopTracking = () => {
    return ipcRenderer.invoke('keyboard-mouse-events', "STOP_EVENT_TRACKING");
}

//Resent keyboard and mouse counts.
const resetCounts = () => {
    return ipcRenderer.invoke('keyboard-mouse-events', "RESET_COUNTS");
}


//Get keyboard and mouse counts.
const getCounts = () => {
    return ipcRenderer.invoke('keyboard-mouse-events', "GET_COUNTS");
}

//Get time when last time keyboard and mouse event occured.
const getLastEventTime = () => {
    return ipcRenderer.invoke('keyboard-mouse-events', "GET_LAST_EVENT_TIME");
}


module.exports = {
    startTracking,
    stopTracking,
    resetCounts,
    getCounts,
    getLastEventTime
};