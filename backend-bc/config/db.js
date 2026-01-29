const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.USERDB || 'postgres',
  host: 'localhost',
  database: process.env.NAMEDB || 'bc',
  password: process.env.PASSWORDDB || 'admin',
  port: process.env.PORTDB || 5432,
});

module.exports = pool;