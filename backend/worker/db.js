const { Pool } = require('pg');

// 1. Connect to your PostgreSQL Database
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'picklabs_db',
    password: 'your_db_password',
    port: 5432,
});

module.exports = { pool };
