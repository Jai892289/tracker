import { put, takeLatest, call, select, delay } from 'redux-saga/effects'

//Import API Service.
import { postWithoutHeaderRequestAPI, postRequestAPI } from '../../services/API/api';

//Import Utils.
import { setAuthToken, clearAuthToken } from '../../utils/sessionStorage';
import { setUserLocalStorage } from '../../utils/localStorage';

function* userSigninRequest(action) {
    try {

        const response = yield call(postWithoutHeaderRequestAPI, { url: '/api/auth/login/', data: action.formData });

        if (response.FLAG === 1) {

            let tempObjUser = response.DATA;
            tempObjUser.email = action.formData.email;
            tempObjUser.password = action.formData.password;
            tempObjUser.rememberMe = action.formData.rememberMe;

            setAuthToken(tempObjUser.auth_token);
            setUserLocalStorage(tempObjUser);

            delete tempObjUser.password;

            yield put({ type: 'USER_SIGNIN_SUCCEEDED', objUser: tempObjUser });
            yield put({ type: 'APP_CONFIG_REQUESTED' });
            yield put({ type: 'PROJECT_LIST_REQUESTED' });
            yield put({ type: 'TODAY_TIME_SUMMARY_REQUESTED' });
            yield put({ type: 'BULK_ROW_DATA_SYNC_SERVER_REQUESTED' });
            yield delay(30000);
            yield put({ type: 'BULK_IMAGES_DATA_SYNC_SERVER_REQUESTED', payload: { syncType: "CURRENT_USER_IMAGES" } });

        } else {

            let errorMessage = response.MESSAGE;

            /* 
            When user signin in offline mode and internet connection back again,
            System try to authenticate that user if we get any repose other then success from signin API then
            we will forcefully signout user from system.
            */
            const isOfflineSignin = yield select(state => state.isOfflineSignin);
            if (isOfflineSignin) {
                errorMessage = "Invalid Signin Credentials: Force Singout";
                yield put({ type: 'USER_SIGNOUT_POPUP_REQUESTED', strUserSignoutPopup: "directSignout" });
            }

            yield put({ type: 'USER_SIGNIN_FAILED', objNotification: { type: "error", message: errorMessage } });

        }
    } catch (error) {
        yield put({ type: 'USER_SIGNIN_FAILED', objNotification: { type: "error", message: error.message } });
    }
}

function* userSignOutRequest() {
    try {
        const isTrackerStart = yield select(state => state.isTrackerStart);
        if (isTrackerStart) {
            yield put({ type: 'STOP_TRACKER', payload: { inActivityEndTime: new Date().getTime(), inTrackerStop: 1 } });
            yield delay(3000);
        }
        yield call(postRequestAPI, { url: '/api/auth/logout/' });
        clearAuthToken();
        yield put({ type: 'USER_SIGNOUT_SUCCEEDED' });
    } catch (error) {
        clearAuthToken();
        yield put({ type: 'USER_SIGNOUT_SUCCEEDED' });
    }
}


function* watchAuthRequests() {
    yield takeLatest('USER_SIGNIN_REQUESTED', userSigninRequest);
    yield takeLatest('USER_SIGNOUT_REQUESTED', userSignOutRequest);
}

function* authSagas() {
    yield watchAuthRequests();
}

export default authSagas;