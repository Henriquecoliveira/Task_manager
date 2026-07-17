const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: "Task_manager",
    waitForConnections: true,
    queueLimit: 0
})

module.exports = db;