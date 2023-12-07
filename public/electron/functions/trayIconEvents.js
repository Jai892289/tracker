//List of function to tracke Tray icon events using ipcRenderer.

//Import class.
const { ipcRenderer } = require('electron');

//Set tray icon online/offline.
const setTrayOnlineStatus = (status) => {
    if (status) {
        return ipcRenderer.invoke('tracker-tray-events', "SET_TRAY_ONLINE");
    }
    return ipcRenderer.invoke('tracker-tray-events', "SET_TRAY_OFFLINE");
}

const stopTracker = (callback) => {
    ipcRenderer.on("STOP_TRACKER", callback);
}

module.exports = {
    setTrayOnlineStatus,
    stopTracker
};