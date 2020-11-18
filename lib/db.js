const { Pool } = require("pg");

const pool = new Pool({
  user: "nwxdzgbl",
  password: "HH40NNYUmI2SSMcvGXu1xMbEzartv_-2",
  host: "john.db.elephantsql.com",
  port: 5432,
  database: "nwxdzgbl",
});

module.exports = pool;
