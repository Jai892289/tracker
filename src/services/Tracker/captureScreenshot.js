//Import Reducer store.
import store from '../../redux/Store/store';

//Import Constants.
import { IMAGE_RESOLUTION } from '../../shared/constants';

//Import Utils.
import { convertToUTC } from '../../utils/functions';

//Return Main Screen media stream.
const getMainScreenMediaStream = () => {
    return new Promise(async (resolve, reject) => {
        let mediaDeviceStream = null;
        try {
            //Connect to media stream.
            const mainScreenSoure = await window.tracker.desktopCapturer.captureMainScreen(IMAGE_RESOLUTION);
            mediaDeviceStream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: mainScreenSoure.id,
                        minWidth: IMAGE_RESOLUTION.width,
                        maxWidth: IMAGE_RESOLUTION.width,
                        minHeight: IMAGE_RESOLUTION.height,
                        maxHeight: IMAGE_RESOLUTION.height
                    }
                }
            })
            resolve(mediaDeviceStream);
        } catch (error) {
            //Destroy connection to media stream.
            mediaDeviceStream?.getTracks()[0].stop();
            reject(error);
        }
    });
}

//Return Webcam media stream.
const getWebcamMediaStream = () => {
    return new Promise(async (resolve, reject) => {
        let mediaDeviceStream = null;
        try {
            //Connect to media stream.
            mediaDeviceStream = await navigator.mediaDevices.getUserMedia({ audio: false, video: IMAGE_RESOLUTION });
            resolve(mediaDeviceStream);
        } catch (error) {
            //Destroy connection to media stream.
            mediaDeviceStream?.getTracks()[0].stop();
            reject(error);
        }
    });
}

//Capture image from media stream and return image in base64 formate.
const captureImage = (mediaDeviceStream) => {
    return new Promise(async (resolve, reject) => {
        try {

            //Create hidden video tag.
            const video = document.createElement('video');
            video.style.width = IMAGE_RESOLUTION.width;
            video.style.height = IMAGE_RESOLUTION.height;
            video.srcObject = mediaDeviceStream;

            video.onloadedmetadata = async (e) => {

                video.play();

                //Create canvas and draw video on canvas.
                const canvas = document.createElement('canvas');
                canvas.width = IMAGE_RESOLUTION.width;
                canvas.height = IMAGE_RESOLUTION.height;
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                //Get image data url from canvas - base64.           
                let imageDataURL = canvas.toDataURL('image/webp');

                //Remove canvas
                canvas.remove();
                //Remove hidden video tag
                video.remove();
                //Destroy connection to stream
                mediaDeviceStream.getTracks()[0].stop();

                resolve(imageDataURL);

            };

        } catch (error) {

            //Destroy connection to stream
            mediaDeviceStream?.getTracks()[0].stop();

            reject(error);
        }
    });
}

//Save image data to local db.
const saveImageData = (activityRowData, imageDataURL, imgType) => {
    return new Promise(async (resolve, reject) => {
        try {

            let imageData = {
                activityID: activityRowData.activityID,
                userID: activityRowData.userID,
                imgURL: imageDataURL,
                imgType: imgType,
                imgCaptureTime: convertToUTC(new Date()),
                isDeleted: 0
            }

            await window.tracker.db.saveActivityImageData(imageData);

            resolve(true);

        } catch (error) {
            reject(error);
        }
    });
}

//Capute and save main screen image into local db.
export const captureScreenshot = async (activityRowData) => {
    try {
        const mediaDeviceStream = await getMainScreenMediaStream();
        const imageDataURL = await captureImage(mediaDeviceStream);
        await saveImageData(activityRowData, imageDataURL, 1);
    } catch (error) {
        store.dispatch({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'captureScreenshot()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

//Capute and save webcam image into local db.
export const captureWebcamshot = async (activityRowData) => {
    try {
        const mediaDeviceStream = await getWebcamMediaStream();
        const imageDataURL = await captureImage(mediaDeviceStream);
        await saveImageData(activityRowData, imageDataURL, 2);
    } catch (error) {
        if (error.message !== "Requested device not found") {
            store.dispatch({
                type: 'ERROR_HANDLER_POPUP_REQUESTED',
                payload: {
                    strErrorHandlerPopup: 'show',
                    objErrorHandler: { strFunction: 'captureWebcamshot()', strMessage: error.message, inCriticality: 2 }
                }
            });
        }
    }
}