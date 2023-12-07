import { takeEvery, takeLeading, call, put, select } from 'redux-saga/effects'

//Import API Service.
import { postRequestAPI } from '../../services/API/api';

function* singleRowDataSyncServerRequest(action) {
    try {
        const { isSystemOnline } = yield select(state => state);
        if (isSystemOnline) {
            let activityData = yield call(window.tracker.db.getActivityById, action.payload.id);
            if (activityData && activityData.in_id) {
                delete activityData.in_id
                const response = yield call(postRequestAPI, { url: '/api/user-activity/sync/', data: activityData });
                if (response.FLAG === 1) {
                    yield call(window.tracker.db.deleteActivityById, action.payload.id);
                } else {
                    yield put({
                        type: 'ERROR_HANDLER_POPUP_REQUESTED',
                        payload: {
                            strErrorHandlerPopup: 'show',
                            objErrorHandler: { strFunction: 'singleRowDataSyncServerRequest()', strMessage: response.message, inCriticality: 2 }
                        }
                    });
                }
            }
        }
        yield put({ type: 'SINGLE_ROW_DATA_SYNC_SERVER_COMPLETED' });
    } catch (error) {
        yield put({ type: 'SINGLE_ROW_DATA_SYNC_SERVER_COMPLETED' });
        yield put({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'singleRowDataSyncServerRequest()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

function* bulkRowDataSyncServerRequest(action) {
    try {

        const { inActivityRowDataID, isSystemOnline, objUser } = yield select(state => state);

        if (Object.keys(objUser).length !== 0 && isSystemOnline) {

            let activityData = yield call(window.tracker.db.getActivityByUser, objUser.user_id, inActivityRowDataID);

            if (activityData.length !== 0) {

                for (let row of activityData) {
                    try {
                        const response = yield call(postRequestAPI, { url: '/api/user-activity/sync/', data: row });
                        if (response.FLAG === 1) {
                            yield call(window.tracker.db.deleteActivityById, row.in_id);
                        } else {
                            yield put({
                                type: 'ERROR_HANDLER_POPUP_REQUESTED',
                                payload: {
                                    strErrorHandlerPopup: 'show',
                                    objErrorHandler: { strFunction: 'bulkRowDataSyncServerRequest()', strMessage: response.message, inCriticality: 2 }
                                }
                            });
                        }
                    } catch (internalError) {
                        yield put({
                            type: 'ERROR_HANDLER_POPUP_REQUESTED',
                            payload: {
                                strErrorHandlerPopup: 'show',
                                objErrorHandler: { strFunction: 'bulkRowDataSyncServerRequest()', strMessage: internalError.message, inCriticality: 2 }
                            }
                        });
                    }
                }
            }

        }

        yield put({ type: 'BULK_ROW_DATA_SYNC_SERVER_COMPLETED' });

    } catch (error) {
        yield put({ type: 'BULK_ROW_DATA_SYNC_SERVER_COMPLETED' });
        yield put({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'bulkRowDataSyncServerRequest()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

function* bulkImagesDataSyncServerRequest(action) {
    try {

        const { objUser, isSystemOnline } = yield select(state => state);

        if (Object.keys(objUser).length !== 0 && isSystemOnline) {

            let recordStartWith = 0;
            let activityImagesData = [];
            let successfullySyncImages = 0;

            while (true) {

                successfullySyncImages = 0;

                if (action.payload.syncType === "CURRENT_SESSION_IMAGES") {
                    activityImagesData = yield call(window.tracker.db.getActivityImagesDataBySessionID, action.payload.id, recordStartWith);
                } else {
                    activityImagesData = yield call(window.tracker.db.getActivityImagesDataByUserID, objUser.user_id, recordStartWith);
                }

                if (activityImagesData.length === 0) {
                    break;
                }

                try {
                    const response = yield call(postRequestAPI, { url: '/api/my-daily-activity-images/', data: { data: activityImagesData } });
                    if (response.FLAG === 1) {
                        successfullySyncImages = response.success.length;
                        for (let id of response.success) {
                            yield call(window.tracker.db.deleteActivityImagesById, id);
                        }
                    } else {
                        yield put({
                            type: 'ERROR_HANDLER_POPUP_REQUESTED',
                            payload: {
                                strErrorHandlerPopup: 'show',
                                objErrorHandler: { strFunction: 'bulkImagesDataSyncServerRequest()', strMessage: response.message, inCriticality: 2 }
                            }
                        });
                    }
                } catch (internalError) {
                    yield put({
                        type: 'ERROR_HANDLER_POPUP_REQUESTED',
                        payload: {
                            strErrorHandlerPopup: 'show',
                            objErrorHandler: { strFunction: 'bulkImagesDataSyncServerRequest()', strMessage: internalError.message, inCriticality: 2 }
                        }
                    });
                }

                recordStartWith += 5;
                recordStartWith -= successfullySyncImages;
            }

        }

        yield put({ type: 'BULK_IMAGES_DATA_SYNC_SERVER_COMPLETED' });

    } catch (error) {
        yield put({ type: 'BULK_IMAGES_DATA_SYNC_SERVER_COMPLETED' });
        yield put({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'bulkImagesDataSyncServerRequest()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

function* watchSyncRequests() {
    yield takeEvery('SINGLE_ROW_DATA_SYNC_SERVER_REQUESTED', singleRowDataSyncServerRequest);
    yield takeLeading('BULK_ROW_DATA_SYNC_SERVER_REQUESTED', bulkRowDataSyncServerRequest);
    yield takeLeading('BULK_IMAGES_DATA_SYNC_SERVER_REQUESTED', bulkImagesDataSyncServerRequest);
}

function* syncSagas() {
    yield watchSyncRequests();
}

export default syncSagas;