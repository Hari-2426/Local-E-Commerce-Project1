const pool = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Database connection successful:', rows[0].result === 2);

        const [databases] = await pool.query('SHOW DATABASES LIKE "localshop_db"');
        if (databases.length > 0) {
            console.log('Database "localshop_db" exists.');
            const [tables] = await pool.query('SHOW TABLES FROM localshop_db');
            console.log('Tables in localshop_db:', tables.map(t => Object.values(t)[0]));
        } else {
            console.log('Database "localshop_db" does NOT exist. Please run schema.sql.');
        }
        process.exit(0);
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

testConnection();
