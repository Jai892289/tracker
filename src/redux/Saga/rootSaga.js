import { all } from 'redux-saga/effects'

//Import Sagas.
import authSagas from './authSagas';
import appConfigSagas from './appConfigSagas';
import userSagas from './userSagas';
import trackerSagas from './trackerSagas';
import syncSagas from './syncSagas';
import errorHandlerSagas from './errorHandlerSagas';

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
function* rootSaga() {
    yield all([
        authSagas(),
        appConfigSagas(),
        userSagas(),
        trackerSagas(),
        syncSagas(),
        errorHandlerSagas()
    ])
}

export default rootSaga;