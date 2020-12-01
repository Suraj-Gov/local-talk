const knex = require("knex")({
  client: "pg",
  connection:
    process.env.NODE_ENV === "production"
      ? {
          host: "local-talk.cdhrvmblc8eq.ap-south-1.rds.amazonaws.com",
          port: 5432,
          user: "postgres",
          database: "local_talk",
          password: process.env.AWS_RDS_PASS,
        }
      : {
          host: "localhost",
          port: 5432,
          user: "postgres",
          database: "local_talk",
          password: "postgres",
        },
});

module.exports = knex;
