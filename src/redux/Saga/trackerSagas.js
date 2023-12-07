//Import Redux-Saga releated function.
import { put, takeLatest } from 'redux-saga/effects'

//Import Utils.
import { startTimer, stopTimer } from '../../services/Tracker/tracker';

function* startTracker() {
    try {
        yield put({
            type: 'ACTIVITY_NAME_POPUP',
            payload: {
                strActivityNamePopup: "show"
            }
        });
        startTimer();
    } catch (error) {
        yield put({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'startTracker()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

function* stopTracker(action) {
    try {
        stopTimer(action.payload);
    } catch (error) {
        yield put({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'stopTracker()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

function* watchTrackerSagasActions() {
    yield takeLatest('START_TRACKER', startTracker);
    yield takeLatest('STOP_TRACKER', stopTracker);
}

function* trackerSagas() {
    yield watchTrackerSagasActions();
}

export default trackerSagas;