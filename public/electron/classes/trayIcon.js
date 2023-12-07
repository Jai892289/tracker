const { app, Tray, Menu, BrowserWindow, dialog, nativeImage } = require('electron');
const path = require('path');

class TrayIcon {

  constructor() {
    this.trayIcon = null;
    this.tray = null;
    this.isQuiting = false;
    this.isTrackerStarted = false;
    this.isTrackerOnline = false;
    this.setTray();
  }

  setTray = () => {

    app.whenReady().then(() => {

      //Get main window.
      this.mainWindow = BrowserWindow.getAllWindows()[0];

      //Get tray icon image.
      this.prepareTrayIcon();

      //Create tray icon instance.
      this.tray = new Tray(this.trayIcon);
      //Set tray icon tooltip.
      this.tray.setToolTip(app.getName());

      if (process.platform === "win32") {
        //Set tray icon click event.
        this.tray.on('click', () => { this.mainWindow.show(); });
      }

      //Set tray icon right-click menus.
      var self = this;
      this.tray.setContextMenu(Menu.buildFromTemplate([
        {
          label: `Open ${app.getName()}`, click: () => { self.mainWindow.show(); }
        },
        { type: "separator" },
        {
          label: `Quit ${app.getName()}`, click: () => { this.showConfirmIfTracking(); }
        }
      ]));

      //Set main window events.
      this.handleMainWindowEvents();

    })

    app.on('before-quit', (e) => {
      console.log('app befaure-quit called');
      this.isQuiting = true;
      if (this.isTrackerStarted) {
        e.preventDefault();
      }
      this.showConfirmIfTracking();
    });

    app.on('will-quit', () => {
      console.log('app will-quit called');
    });

    app.on('quit', () => {
      console.log('app quit called');
    });

  }

  showConfirmIfTracking = () => {
    if (this.isTrackerStarted) {
      this.isQuiting = false;
      this.mainWindow.show();
      this.showDialog();
    } else {
      this.destroyTrayAndWindow();
    }
  }

  showDialog = () => {
    dialog.showMessageBox(this.mainWindow, {
      title: "Confirmation",
      message: 'Are you sure you wants to stop timer?',
      type: "question",
      buttons: ["No", "Yes"]
    }).then(res => {
      if (res.response == 1) {
        this.isQuiting = true;
        this.mainWindow.webContents.send('STOP_TRACKER', '');
        setTimeout(() => { this.destroyTrayAndWindow(); }, 3000);
      }
    });
  }

  handleMainWindowEvents = () => {
    this.mainWindow.on('close', (event) => {
      if (!this.isQuiting) {
        event.preventDefault();
        this.mainWindow.hide();
        event.returnValue = false;
      }
    });
  }

  destroyTrayAndWindow = () => {
    this.tray?.destroy();
    this.tray = null;
    this.mainWindow?.destroy();
  }

  getImagePath = (name) => {
    return path.join(__dirname, `../../assets/images/${name}`);
  }

  setTrackingStarted = () => {
    this.isTrackerStarted = true;
    this.setTrayIcon();
  }

  setTrackingStoped = () => {
    this.isTrackerStarted = false;
    this.setTrayIcon();
  }

  setOffline = () => {
    this.isTrackerOnline = false;
    this.setTrayIcon();
  }

  setOnline = () => {
    this.isTrackerOnline = true;
    this.setTrayIcon();
  }

  setTrayIcon = () => {
    this.prepareTrayIcon();
    if (this.tray) {
      this.tray.setImage(this.trayIcon);
    }
  }

  prepareTrayIcon = () => {
    if (!this.isTrackerStarted) {
      this.trayIcon = this.getImagePath('icon-off.png');
    } else {
      if (this.isTrackerOnline) {
        this.trayIcon = this.getImagePath('icon-online.png');
      } else {
        this.trayIcon = this.getImagePath('icon-offline.png');
      }
    }
    this.trayIcon = nativeImage.createFromPath(this.trayIcon);
    this.trayIcon = this.trayIcon.resize({ width: 16, height: 16 });
  }
}

module.exports = TrayIcon;