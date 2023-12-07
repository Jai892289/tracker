const { desktopCapturer } = require('electron');

//Get details of Main screen of the system.
const captureMainScreen = async (IMAGE_RESOLUTION) => {
    let source = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: IMAGE_RESOLUTION });
    source = source.filter(item => item.name === "Entire Screen");
    return source[0];
}

// // //Get details of number of windows running in the system.
// const captureWindows = () => {
//     return desktopCapturer.getSources({ types: ['window', 'screen'], thumbnailSize: { width: 1280, height: 720 } });
// }

module.exports = {
    captureMainScreen,
    // captureWindows
};