const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "postgresemeka",
  host: "localhost",
  port: 5432,
  database: "inec",
});

module.exports = pool;