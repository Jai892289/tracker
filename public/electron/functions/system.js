//List of function to get system specific data.

//Get system type.
const getSystemType = () => {
    return "Desktop";
}

//Get system MAC address.
const getMacAddress = () => {
    const networkInterfaces = require('os').networkInterfaces();
    let macAddress = "";
    for (let key of Object.keys(networkInterfaces)) {
        let item = networkInterfaces[key];
        if (item[0].mac !== '00:00:00:00:00:00') {
            macAddress = item[0].mac;
        }
    }
    return macAddress;
}

//Get location of application data.
const getAppDataLocation = () => {
    const fs = require('fs');
    const path = require('path');
    let appDataLocation = "";
    switch (process.platform) {
        case "win32":
            const os = require('os');
            appDataLocation = path.join(os.tmpdir(), '../DHTracker');
            break;
        case "linux":
        case "darwin":
            appDataLocation = path.join('/var/tmp', 'DHTracker');
            break;
        default:
    }
    if (!fs.existsSync(appDataLocation)) {
        fs.mkdirSync(appDataLocation);
    }
    return appDataLocation;
}

//Get user system os name.
const getOSName = () => {
    let osName = "";
       switch (process.platform) {
        case "win32":
            osName = "Windows";
            break;
        case "linux":
            osName = "Linux";
            break;
        case "darwin":
            osName = "MacOS";
            break;
        default:
    }
    return osName;
}

module.exports = {
    getSystemType,
    getMacAddress,
    getAppDataLocation,
    getOSName
};