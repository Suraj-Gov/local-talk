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
        res.json({ status: "error" });
      }
      break;

    case "POST":
      try {
        const { user_name, user_email, auth0_id } = req.body;
        const newUser = await pool.query(
          "INSERT INTO users (user_name, user_email, auth0_id) VALUES ($1, $2, $3) RETURNING *",
          [user_name, user_email, auth0_id]
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
