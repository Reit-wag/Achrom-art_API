const mysql = require('mysql2/promise');
const config = require('../config');

const db = mysql.createPool({
    host: config.mysqlHost,
    user: config.mysqlUsername,
    password: config.mysqlPassword,
    database: config.mysqlDatabase
});

module.exports = db;