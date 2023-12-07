//List of function to access database.

//Import SQLite class.
const SQLite3 = require('../classes/sqLite3');

//Create tables necessary for the time tracker application.
const createTables = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            let tableSQL = `
                CREATE TABLE IF NOT EXISTS tbl_activity_row_data (
                    in_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    in_session_id INTEGER NOT NULL,
                    in_user_id INTEGER NOT NULL,
                    in_project_id INTEGER,
                    st_name TEXT,
                    dt_utc_start_time TEXT,
                    dt_utc_end_time TEXT,
                    in_mouse_count INTEGER,
                    in_keyboard_count INTEGER,
                    in_tracker_stop INTEGER
                    )`
            await dbInstance.run(tableSQL);
            tableSQL = `
                CREATE TABLE IF NOT EXISTS tbl_activity_images (
                    in_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    in_session_id INTEGER NOT NULL,
                    in_user_id INTEGER NOT NULL,
                    st_url TEXT,
                    in_image_type INTEGER,
                    dt_utc_capture_time TEXT,
                    in_is_deleted INTEGER
                    )`
            await dbInstance.run(tableSQL);
            tableSQL = `
                CREATE TABLE IF NOT EXISTS tbl_error_logs (
                    in_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    in_user_id INTEGER,
                    in_session_id INTEGER,
                    st_os TEXT,
                    st_function_name TEXT,
                    st_message TEXT,
                    in_criticality INTEGER,
                    st_app_version TEXT
                    )`
            await dbInstance.run(tableSQL);
            tableSQL = `
                CREATE TABLE IF NOT EXISTS tbl_time_summary (
                    in_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    in_user_id INTEGER,
                    dt_summary_date TEXT,
                    in_day_start_time INTEGER,
                    in_total_active_time INTEGER
                    )`
            await dbInstance.run(tableSQL);
            dbInstance.disconnect();
            resolve("All the required table created successfully.");
        } catch (error) {
            reject(error);
        }
    })

}

//Store user activity row data into local db.
const syncActivityRowData = (type, syncData) => {
    return new Promise(async (resolve, reject) => {
        try {

            let query = ``;
            let values = [];

            if (type === "ACTIVITY_START") {
                query = `
                INSERT INTO tbl_activity_row_data (
                    in_session_id,
                    in_user_id,
                    in_project_id,
                    st_name,
                    dt_utc_start_time,
                    dt_utc_end_time,
                    in_mouse_count,
                    in_keyboard_count,
                    in_tracker_stop
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `
                values = [
                    syncData.activityID,
                    syncData.userID,
                    syncData.selectedProjectID,
                    syncData.activityName,
                    syncData.startTime,
                    syncData.endTime,
                    syncData.mouseCount,
                    syncData.keyboardCount,
                    syncData.trackerStop
                ]
            }

            if (type === "ACTIVITY_UPDATE") {
                query = `
                UPDATE tbl_activity_row_data
                SET
                    st_name = ?,
                    dt_utc_end_time = ?,
                    in_mouse_count = ?,
                    in_keyboard_count = ?,
                    in_tracker_stop = ?
                WHERE
                    in_id = ? 
                `
                values = [
                    syncData.activityName,
                    syncData.endTime,
                    syncData.mouseCount,
                    syncData.keyboardCount,
                    syncData.trackerStop,
                    syncData.activityRowDataID
                ]
            }

            const dbInstance = new SQLite3();
            await dbInstance.connect();
            let activityRowDataID = await dbInstance.run(query, values);
            dbInstance.disconnect();

            resolve(activityRowDataID);

        } catch (error) {

            reject(error);

        }

    });
}
const activityFields = ['in_id', 'in_session_id', 'in_user_id', 'in_project_id', 'st_name', 'dt_utc_start_time', 'dt_utc_end_time', 'in_mouse_count', 'in_keyboard_count', 'in_tracker_stop'];
//Get user activity row data from local db.
const getActivityById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let values = [id];
            let query = `
                SELECT 
                    ${activityFields.join(',')}
                FROM tbl_activity_row_data 
                WHERE
                    in_id = ? 
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            let activityRowData = await dbInstance.selectByID(query, values);
            dbInstance.disconnect();
            resolve(activityRowData);

        } catch (error) {

            reject(error);

        }

    });
}
//Get user activity row data from local db.
const getActivityByUser = (user_id, id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const in_id = id ? id : 0
            let values = [in_id, user_id];
            let query = `
                SELECT 
                    ${activityFields.join(',')}
                FROM tbl_activity_row_data 
                WHERE
                    in_id != ? 
                    AND in_user_id = ?
                order by
                    in_id asc
                `;

            const dbInstance = new SQLite3();
            await dbInstance.connect();
            let activityRowData = await dbInstance.all(query, values);
            dbInstance.disconnect();
            resolve(activityRowData);

        } catch (error) {

            reject(error);

        }

    });
}

//Delete user activity row data from local db.
const deleteActivityById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let values = [id];
            let query = `
                DELETE
                FROM tbl_activity_row_data 
                WHERE
                    in_id = ? 
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            let activityRowData = await dbInstance.run(query, values);
            dbInstance.disconnect();
            resolve(activityRowData);

        } catch (error) {

            reject(error);

        }

    });
}

//Save webcamp and main screen-shot data into local db.
const saveActivityImageData = (ImageData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = `
                INSERT INTO tbl_activity_images (
                    in_session_id,
                    in_user_id,
                    st_url,
                    in_image_type,
                    dt_utc_capture_time,
                    in_is_deleted
                    )
                VALUES (?, ?, ?, ?, ?, ?)
                `
            let values = [
                ImageData.activityID,
                ImageData.userID,
                ImageData.imgURL,
                ImageData.imgType,
                ImageData.imgCaptureTime,
                ImageData.isDeleted
            ]

            const dbInstance = new SQLite3();
            await dbInstance.connect();
            await dbInstance.run(query, values);
            dbInstance.disconnect();

            resolve();

        } catch (error) {

            reject(error);

        }

    });
}

//Get user activity images data by sessionID from local db.
const getActivityImagesDataBySessionID = (sessionID, recordStartWith) => {
    return new Promise(async (resolve, reject) => {
        try {
            const values = [sessionID];
            const query = `
                SELECT 
                    *
                FROM 
                    tbl_activity_images
                WHERE
                    in_session_id = ?
                LIMIT
                    ${recordStartWith},5
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.all(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}

//Get user activity images data by userID from local db.
const getActivityImagesDataByUserID = (userID, recordStartWith) => {
    return new Promise(async (resolve, reject) => {
        try {
            const values = [userID];
            const query = `
                SELECT 
                    *
                FROM 
                    tbl_activity_images
                WHERE
                    in_user_id = ?
                LIMIT
                    ${recordStartWith},5
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.all(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}


//Delete user activity images data from local db.
const deleteActivityImagesById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const values = [id];
            const query = `
                DELETE
                FROM
                    tbl_activity_images 
                WHERE
                    in_id = ?
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.run(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}

//Save error logs data into local db.
const saveErrorLogsData = (errorData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = `
                INSERT INTO tbl_error_logs (
                    in_user_id,
                    in_session_id,
                    st_os,
                    st_function_name,
                    st_message,
                    in_criticality,
                    st_app_version
                    )
                VALUES (?, ?, ?, ?, ?, ?, ?)                `
            let values = [
                errorData.in_user_id,
                errorData.in_session_id,
                errorData.st_os,
                errorData.st_function_name,
                errorData.st_message,
                errorData.in_criticality,
                errorData.st_app_version
            ]
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            await dbInstance.run(query, values);
            dbInstance.disconnect();
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

//Save user today time summary in the local db.
const saveUserTodayTimeSummary = (summaryData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = `
                INSERT INTO tbl_time_summary (
                    in_user_id,
                    dt_summary_date,
                    in_day_start_time,
                    in_total_active_time
                    )
                VALUES (?, ?, ?, ?)                `
            let values = [
                summaryData.userID,
                summaryData.summaryDate,
                summaryData.dayStartTime,
                summaryData.totalActiveTime
            ]
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.run(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}

//Update user today time summary into local db - Update active time.
const updateUserTodayTimeSummary = (todayTimeSummaryRowDataID, totalActiveTime) => {
    return new Promise(async (resolve, reject) => {
        try {
            const query = `
                UPDATE tbl_time_summary
                SET
                    in_total_active_time = ?
                WHERE
                    in_id = ? 
                `
            const values = [
                totalActiveTime,
                todayTimeSummaryRowDataID
            ]
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.run(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}

//Get user today time summary from local db.
const getUserTodayTimeSummary = (userID, todayDate) => {
    return new Promise(async (resolve, reject) => {
        try {
            const values = [userID, todayDate];
            const query = `
                SELECT 
                    *
                FROM 
                    tbl_time_summary
                WHERE
                    in_user_id = ?
                AND
                    dt_summary_date = ?
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.selectByID(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}

//Delete user today time summary from local db.
const deleteUserTodayTimeSummary = (userID) => {
    return new Promise(async (resolve, reject) => {
        try {
            const values = [userID];
            const query = `
                DELETE
                FROM
                    tbl_time_summary 
                WHERE
                    in_user_id = ?
                `;
            const dbInstance = new SQLite3();
            await dbInstance.connect();
            const queryResponse = await dbInstance.run(query, values);
            dbInstance.disconnect();
            resolve(queryResponse);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    createTables,
    syncActivityRowData,
    getActivityById,
    deleteActivityById,
    saveActivityImageData,
    getActivityByUser,
    getActivityImagesDataBySessionID,
    getActivityImagesDataByUserID,
    deleteActivityImagesById,
    saveErrorLogsData,
    saveUserTodayTimeSummary,
    updateUserTodayTimeSummary,
    getUserTodayTimeSummary,
    deleteUserTodayTimeSummary
};