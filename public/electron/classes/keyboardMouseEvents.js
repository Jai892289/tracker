//Import NPM Packages.
const ioHook = require('iohook');

class KeyboardMouseEvents {

  constructor() {
    this.keyboardCounts = 0;
    this.mouseCounts = 0;
    this.lastEventTime = new Date().getTime();

    ioHook.on('keydown', () => {
      this.keyboardCounts++;
      this.lastEventTime = new Date().getTime();
    });

    ioHook.on('mouseclick', () => {
      this.mouseCounts++;
      this.lastEventTime = new Date().getTime();
    });

    ioHook.on('mousemove', () => {
      this.lastEventTime = new Date().getTime();
    });

    ioHook.on('mousewheel', () => {
      this.lastEventTime = new Date().getTime();
    });

  }

  startTracking = () => {
    ioHook.start();
  }

  stopTracking = () => {
    this.keyboardCounts = 0;
    this.mouseCounts = 0;
    ioHook.stop();
  }

  resetCounts = () => {
    this.keyboardCounts = 0;
    this.mouseCounts = 0;
  }

  getCounts = () => {
    return {
      keyboardCounts: this.keyboardCounts,
      mouseCounts: this.mouseCounts
    }
  }

  getLastEventTime = () => {
    return this.lastEventTime;
  }

}

module.exports = KeyboardMouseEvents;