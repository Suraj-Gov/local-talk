const { Client } = require("pg");

const client = new Client(
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
      }
);

client.connect().then(() => console.log("client connected"));

module.exports = client;
