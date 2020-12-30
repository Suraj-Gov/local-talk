// USAGE

// GET fetches all users ordered by their user_id
// POST creates a new user needs - user_name, user_email, auth0_id

import pool from "../../../lib/db";

export default async function userHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      console.log(req.query);
      try {
        const users = await pool.query("SELECT * FROM users ORDER BY user_id");
        console.log(users.rows, "got these for all users");
        res.json(users.rows);
      } catch (error) {
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    case "POST":
      try {
        const { user_name, user_email, auth0_id, user_picture } = req.body;
        const newUser = await pool.query(
          "INSERT INTO users (user_name, user_email, auth0_id, user_picture) VALUES ($1, $2, $3, $4) RETURNING *",
          [user_name, user_email, auth0_id, user_picture]
        );
        console.log(newUser.rows[0], "added this user");
        res.json(newUser.rows[0]);
      } catch (error) {
        console.error(error);
      }
      break;

    default:
      res.status(405);
      break;
  }
  pool.end().then(() => console.log("connection terminated"));
}
