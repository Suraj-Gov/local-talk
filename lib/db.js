const { Pool } = require("pg");

const pool = new Pool(
  process.env.NODE_ENV === "development"
    ? {
        user: "postgres",
        password: "postgres",
        host: "localhost",
        port: 5432,
        database: "local_talk",
      }
    : {
        user: "postgres",
        password: process.env.AWS_RDS_PASS,
        host: "local-talk.cdhrvmblc8eq.ap-south-1.rds.amazonaws.com",
        port: 5432,
        database: "local_talk",
      }
);

module.exports = pool;
