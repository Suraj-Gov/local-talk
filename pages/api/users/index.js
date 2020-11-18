import pool from "../../../lib/db";

export default async function userHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const users = await pool.query("SELECT * FROM users ORDER BY user_id");
        console.log(users.rows, "got these for all users");
        res.json(users.rows);
      } catch (error) {
        console.error(error);
      }
      break;

    case "POST":
      try {
        const { user_name, user_email } = req.body;
        const newUser = await pool.query(
          "INSERT INTO users (user_name, user_email) VALUES ($1, $2) RETURNING *",
          [user_name, user_email]
        );
        console.log(newUser.rows[0], "added this user");
        res.json(newUser.rows[0]);
      } catch (error) {
        console.error(error);
      }
      break;

    default:
      res.status(405);
  }
}
