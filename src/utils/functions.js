//Add zero prefix for single value.
const addZero = (i) => i < 10 ? `0${i}` : i;

//Delay for specific time period.
const delay = ms => new Promise(res => setTimeout(res, ms));

//Convert date to UTC format.
const convertToUTC = (objDate) => {

    //Get current date in UTC formate.
    let date = addZero(objDate.getUTCDate());
    let month = addZero(objDate.getUTCMonth() + 1);
    let year = objDate.getUTCFullYear();

    //Get current time in UTC formate and also add zero prefix for single value.
    let hours = objDate.getUTCHours();
    let min = addZero(objDate.getUTCMinutes());
    let second = addZero(objDate.getUTCSeconds());

    return `${year}-${month}-${date} ${hours}:${min}:${second}`;
};

//Find different between current and given time and return it in specific time formate. [00:00:00]
const calculateTime = (activityStartTime) => {
    let returnValue = `00:00:00`;
    if (activityStartTime !== null) {
        const difference = Math.floor((new Date().getTime() - activityStartTime) / 1000);
        const getHours = `0${Math.floor(difference / 3600)}`.slice(-2);
        const minutes = `${Math.floor(difference / 60)}`;
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getSeconds = `0${(difference % 60)}`.slice(-2);
        returnValue = `${getHours}:${getMinutes}:${getSeconds}`;
    }
    return returnValue;
}

//Convert seconds into specific time formate. [0h 0m]
const secondToTimeFormateV1 = (seconds) => {
    let returnValue = `0h 0m`;
    seconds = parseInt(seconds, 10);
    if (seconds !== 0) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds - (hours * 3600)) / 60);
        returnValue = `${hours}h ${minutes}m`;
    }
    return returnValue;
}

//Get difference of two time interval in seconds.
const getDifferenceInSeconds = (endTime, startTime) => {
    let differenceInSeconds = Math.floor((endTime - startTime) / 1000);
    return differenceInSeconds;
}

//Return random screenshot time.
const getRandomScreenshotTime = (screenshotInterval) => {
    let randomScreenshotTime = Math.random() * (screenshotInterval - 1) + 1;
    return parseInt(randomScreenshotTime) * 60;
}

//Return application configurations data.
const getAppConfigs = (arrAppConfigs) => {

    //Default values for test.
    let localDBSyncTime = 60;
    let serverSyncTime = 30;
    let serverImageSyncTime = serverSyncTime + 5;
    let systemIdleTime = 30;
    let screenshotInterval = 15;
    let isCaptureWebcam = true;
    let isCaptureScreen = true;
    let isManualEntryAllowed = true;
    let isDailyReportSend = true;

    arrAppConfigs.forEach(item => {
        switch (item.name) {
            case "Sync Time":
                serverSyncTime = item.value * 60;
                serverImageSyncTime = serverSyncTime + 5;
                break;
            case "Idle Time":
                systemIdleTime = item.value * 60;
                break;
            case "Screenshot Interval":
                screenshotInterval = parseInt(item.value);
                break;
            case "Webcamshot":
                isCaptureWebcam = item.value === "yes" ? true : false;
                break;
            case "Screenshot":
                isCaptureScreen = item.value === "yes" ? true : false;
                break;
            case "Manual Entry Allowed":
                isManualEntryAllowed = item.value === "yes" ? true : false;
                break;
            case "Daily Report":
                isDailyReportSend = item.value === "yes" ? true : false;
                break;
            default:
        }
    });

    return {
        localDBSyncTime,
        serverSyncTime,
        serverImageSyncTime,
        systemIdleTime,
        screenshotInterval,
        isCaptureWebcam,
        isCaptureScreen,
        isManualEntryAllowed,
        isDailyReportSend
    };

}

const timeSince = (lastSync) => {

    if (lastSync) {

        const seconds = Math.floor((new Date().getTime() - lastSync) / 1000);
        let interval = seconds / 86400;

        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }

        interval = seconds / 3600;

        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }

        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes ago";
        }

        return Math.floor(seconds) + " seconds ago";

    } else {

        return "";

    }

}

//Return start and end date in UTC from current local date.
const getUTCStartAndEndDate = () => {
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    startDate = convertToUTC(startDate);
    endDate = convertToUTC(endDate);
    return { startDate, endDate };
};

module.exports = {
    convertToUTC,
    calculateTime,
    secondToTimeFormateV1,
    getDifferenceInSeconds,
    getRandomScreenshotTime,
    getAppConfigs,
    delay,
    timeSince,
    getUTCStartAndEndDate
};