const { Pool } = require("pg");

const pool = new Pool(
  // process.env.NODE_ENV === "development"
  //   ? {
  //       user: "postgres",
  //       password: "postgres",
  //       host: "localhost",
  //       port: 5432,
  //       database: "local_talk",
  //     }
  {
    connectionString: process.env.POSTGRES_DATABASE_URL,
  }
);

module.exports = pool;
