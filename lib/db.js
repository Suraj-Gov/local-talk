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
        user: "rlqerglliutekr",
        password: process.env.DB_HEROKU,
        host: "ec2-52-71-153-228.compute-1.amazonaws.com",
        port: 5432,
        database: "d6bip28e341ejf",
        ssl: {
          rejectUnauthorized: false,
        },
        idleTimeoutMillis: 2000,
        connectionTimeoutMillis: 1000,
        max: 5,
        keepAlive: false,
      }
);

pool.on("connect", () => {
  console.log(
    "client connected-----------------------------------------------"
  );
});

pool.on("remove", () => {
  console.log("client disconnected xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
});

module.exports = {
  query: (queryString, params, callback) => {
    return pool.query(queryString, params, callback);
  },
};
