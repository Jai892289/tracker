import { put, takeLatest, call, select } from 'redux-saga/effects'

//Import API Service.
import { getRequestAPI, postRequestAPI } from '../../services/API/api';

//Import Utils.
import { setUserProjectsLocalStorage } from '../../utils/localStorage';
import { getUTCStartAndEndDate } from '../../utils/functions';

function* projectListRequest() {
    try {

        const response = yield call(getRequestAPI, { url: '/api/user-project-list' });

        if (response.FLAG === 1) {
            if (response.DATA.length !== 0) {
                setUserProjectsLocalStorage(response.DATA);
                yield put({ type: 'PROJECT_LIST_SUCCEEDED', arrUserProjects: response.DATA });
            }
        } else {
            yield put({ type: 'SET_NOTIFICATION_MESSAGE', objNotification: { type: "error", message: response.MESSAGE } });
        }
    } catch (error) {
        yield put({ type: 'SET_NOTIFICATION_MESSAGE', objNotification: { type: "error", message: error.message } });
    }

}


function* todayTimeSummaryRequest() {
    try {

        const { objUser, isTodayTimeSummaryExist, isSystemOnline } = yield select(state => state);

        if (!isTodayTimeSummaryExist) {

            //Get today date in local timezone.
            const todayDate = new Date().toLocaleDateString();
            //Get today time summary data fron local db.
            const userTodayTimeSummary = yield call(window.tracker.db.getUserTodayTimeSummary, objUser.user_id, todayDate);

            if (userTodayTimeSummary) {

                //Today time summary found in local db, update data in reducer.
                yield put({
                    type: 'UPDATE_TODAY_TIME_SUMMARY_DATA',
                    payload: {
                        todayTimeSummaryRowDataID: userTodayTimeSummary.in_id,
                        dayStartTime: userTodayTimeSummary.in_day_start_time,
                        totalActiveTime: userTodayTimeSummary.in_total_active_time
                    }
                });

            } else {

                //Today time summary not found in local db, so delete the previous summary of the user.
                yield call(window.tracker.db.deleteUserTodayTimeSummary, objUser.user_id);

                if (isSystemOnline) {

                    //Get start and end date-time in UTC timezone for the current date in local timezone.
                    const UTCTimezone = getUTCStartAndEndDate();
                    //Post API data to get today time summary from the server.
                    const postData = {
                        "user_id": objUser.user_id,
                        "query_start_time": UTCTimezone.startDate,
                        "query_end_time": UTCTimezone.endDate
                    }

                    //API call the server to get the today time summary.
                    const response = yield call(postRequestAPI, { url: '/api/day-spent/', data: postData });

                    if (response.FLAG === 1) {

                        if (response.DATA.day_start_time) {

                            //Object to add today time summary data into local db.
                            const todayTimeSummarydata = {
                                userID: objUser.user_id,
                                summaryDate: todayDate,
                                dayStartTime: response.DATA.day_start_time,
                                totalActiveTime: response.DATA.total_active_time
                            }

                            //Add today time summary data into local db.
                            const todayTimeSummaryRowDataID = yield call(window.tracker.db.saveUserTodayTimeSummary, todayTimeSummarydata);

                            //Update today time summary data in reducer.
                            yield put({
                                type: 'UPDATE_TODAY_TIME_SUMMARY_DATA',
                                payload: {
                                    todayTimeSummaryRowDataID: todayTimeSummaryRowDataID,
                                    dayStartTime: response.DATA.day_start_time,
                                    totalActiveTime: response.DATA.total_active_time
                                }
                            });

                        }

                    }

                }

            }

        }

    } catch (error) {
        yield put({
            type: 'ERROR_HANDLER_POPUP_REQUESTED',
            payload: {
                strErrorHandlerPopup: 'show',
                objErrorHandler: { strFunction: 'todayTimeSummaryRequest()', strMessage: error.message, inCriticality: 2 }
            }
        });
    }
}

function* watchUserSagasRequests() {
    yield takeLatest('PROJECT_LIST_REQUESTED', projectListRequest);
    yield takeLatest('TODAY_TIME_SUMMARY_REQUESTED', todayTimeSummaryRequest);
}

function* userSagas() {
    yield watchUserSagasRequests();
}

export default userSagas;