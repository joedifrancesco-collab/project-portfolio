require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const sql = require('mssql');

const config = {
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  database: process.env.DB_NAME || 'ProjectPortfolio',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}

module.exports = { getPool, sql };
