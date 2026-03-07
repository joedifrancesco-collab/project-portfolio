require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'project_portfolio',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

async function getPool() {
  return pool;
}

module.exports = { getPool, pool };
