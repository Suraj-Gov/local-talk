const { Pool } = require("pg");

const pool = new Pool({
  user: "nwxdzgbl",
  password: process.env.DB_PASSWORD,
  host: "john.db.elephantsql.com",
  port: 5432,
  database: "nwxdzgbl",
});

module.exports = pool;
