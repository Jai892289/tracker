import { put, takeLatest, call } from 'redux-saga/effects'

//Import API Service.
import { getRequestAPI } from '../../services/API/api';

//Import Utils.
import { setAppConfigsLocalStorage } from '../../utils/localStorage';

function* appConfigRequest() {
    try {

        const response = yield call(getRequestAPI, { url: '/api/client-app-configuration' });

        if (response.FLAG === 1) {
            setAppConfigsLocalStorage(response.DATA);
            yield put({ type: 'APP_CONFIG_SUCCEEDED', arrAppConfigs: response.DATA });
        } else {
            yield put({ type: 'APP_CONFIG_FAILED', objNotification: { type: "error", message: response.MESSAGE } });
        }
    } catch (error) {
        yield put({ type: 'APP_CONFIG_FAILED', objNotification: { type: "error", message: error.message } });
    }
}

function* watchAppConfigSagasRequests() {
    yield takeLatest('APP_CONFIG_REQUESTED', appConfigRequest);
}

function* appConfigSagas() {
    yield watchAppConfigSagasRequests();
}

export default appConfigSagas;