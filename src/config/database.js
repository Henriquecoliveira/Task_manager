const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "Task_manager",
    waitForConnections: true,
    queueLimit: 0
})

module.exports = db;