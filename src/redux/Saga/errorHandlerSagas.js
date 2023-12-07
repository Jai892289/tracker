import { takeEvery, call, put, select } from 'redux-saga/effects'

//Import API Service.
import { postRequestAPI } from '../../services/API/api';

//Import application package file.
import { version } from '../../../package.json';


function* sendErrorReportToServerRequest(action) {

    let errorData = {};

    try {

        const { objUser, inActivityID } = yield select(state => state);

        errorData = {
            in_user_id: Object.keys(objUser).length !== 0 ? objUser.user_id : null,
            in_session_id: inActivityID,
            st_os: window.tracker.system.getOSName(),
            st_function_name: action.payload.strFunction,
            st_message: action.payload.strMessage,
            st_feedback: action.payload.feedback,
            in_criticality: action.payload.inCriticality,
            st_app_version: version
        }

        if (action.payload.type === 'sendReport') {
            yield call(postRequestAPI, { url: '/api/error-report/', data: errorData });
        }
        else {
            yield call(window.tracker.db.saveErrorLogsData, errorData);
        }

    } catch (error) {
        yield put({ type: 'SET_NOTIFICATION_MESSAGE', objNotification: { type: "error", message: "Error Handler: " + error.message } });
        yield call(window.tracker.db.saveErrorLogsData, errorData);
    }
}

function* watchErrorHandlerRequests() {
    yield takeEvery('SEND_ERROR_REPORT_To_SERVER_REQUESTED', sendErrorReportToServerRequest);
}

function* errorHandlerSagas() {
    yield watchErrorHandlerRequests();
}

export default errorHandlerSagas;