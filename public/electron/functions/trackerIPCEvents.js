//List of ipcMain events to hanlde time tracker ipcRenderer events.

const { ipcMain } = require('electron');

//Handle keyboard-moues ipc events.
const KeyboardMouseEvents = require('../classes/keyboardMouseEvents');
const keyboardMouseEvents = new KeyboardMouseEvents();

//Handle Tray icon events
const TrayIcon = require('../classes/trayIcon');
const trayIcon = new TrayIcon();

ipcMain.handle('keyboard-mouse-events', (event, argument) => {

    let returnValue = "";

    switch (argument) {
        case "START_EVENT_TRACKING":
            keyboardMouseEvents.startTracking();
            trayIcon.setTrackingStarted();
            break;
        case "STOP_EVENT_TRACKING":
            keyboardMouseEvents.stopTracking();
            trayIcon.setTrackingStoped();
            break;
        case "RESET_COUNTS":
            keyboardMouseEvents.resetCounts();
            break;
        case "GET_COUNTS":
            returnValue = keyboardMouseEvents.getCounts();
            break;
        case "GET_LAST_EVENT_TIME":
            returnValue = keyboardMouseEvents.getLastEventTime();
            break;
        default:
        // code block
    }

    return returnValue;
})

ipcMain.handle('tracker-tray-events', (event, argument) => {

    let returnValue = "";

    switch (argument) {
        case "SET_TRAY_ONLINE":
            trayIcon.setOnline();
            break;
        case "SET_TRAY_OFFLINE":
            trayIcon.setOffline();
            break;
        default:
        // code block
    }

    return returnValue;
})