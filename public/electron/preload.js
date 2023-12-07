//Import electron packages.
const { contextBridge } = require('electron');

//Import custom API/Function.
const system = require('./functions/system');
const db = require('./functions/db');
const keyboardMouseEvents = require('./functions/keyboardMouseEvents');
const trayIconEvents = require('./functions/trayIconEvents');
const desktopCapturer = require('./functions/desktopCapturer');

contextBridge.exposeInMainWorld('tracker', {
  system,
  db,
  keyboardMouseEvents,
  trayIconEvents,
  desktopCapturer
});
