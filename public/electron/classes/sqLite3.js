const path = require('path');
const { getAppDataLocation } = require('../functions/system');

class SQLite3 {

  constructor() {
    this.db = null;
    this.dbFilePath = path.join(getAppDataLocation(), 'DHTracker.sqlite3');
  }

  connect = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const sqlite3 = require('sqlite3');
        this.db = await new sqlite3.Database(this.dbFilePath);
        resolve("Connected to Database.");
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect = () => {
    this.db.close();
  }

  run = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  selectByID = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, function (error, data) {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  all = (sql, params = []) => {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, function (error, rows) {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

}

module.exports = SQLite3;