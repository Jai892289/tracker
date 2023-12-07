// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow = null;

//Disable menu and devlopment tool in production.
if (app.isPackaged) { Menu.setApplicationMenu(false); }

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 450,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'electron/preload.js')
        },
        resizable: !app.isPackaged,
        icon: path.join(__dirname, 'assets/images/icon.png')
    })

    // and load the index.html of the app.
    //   mainWindow.loadFile('index.html')
    mainWindow.loadURL(
        !app.isPackaged
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    );

}

//Check whether a single instance of an application is running or not.
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            mainWindow.show();
        }
    })

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(() => {
        createWindow()

        app.on('activate', function () {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) createWindow()

        });

        //Create SQLight3 database with necessary table, if not found.
        const { createTables } = require('./electron/functions/db');
        createTables();

    })

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bar to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    })


    // In this file you can include the rest of your app's specific main process
    // code. You can also put them in separate files and require them here.
    require('./electron/functions/trackerIPCEvents');

}