const sql = require('mssql');

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'ProjectPortfolio',
  options: {
    trustedConnection: true,      // Windows Authentication
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
