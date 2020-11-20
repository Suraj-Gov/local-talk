const pool = require("../../../lib/db");

export default async function userHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      console.log(req.query);
      try {
        const auth0_id = req.query.id;
        const getUser = await pool.query(
          "SELECT * FROM users WHERE auth0_id = ($1)",
          [auth0_id]
        );
        console.log(getUser.rows[0], `got this user for auth0id: ${auth0_id}`);
        if (getUser.rows[0] === undefined) {
          console.log("user not in database");
          res.json({ message: "user not found" });
          return;
        }
        res.json(...getUser.rows);
      } catch (error) {
        console.error(error);
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    case "PUT":
      try {
        const id = req.query.id;
        const { upvote } = req.body;
        const updateUser = await pool.query(
          upvote
            ? "UPDATE users SET user_points = (user_points + 1) WHERE user_id = ($1) RETURNING *"
            : "UPDATE users SET user_points = (user_points - 1) WHERE user_id = ($1) RETURNING *",
          [id]
        );
        console.log(
          `successfully ${upvote ? "upvoted" : "downvoted"} for user ${id}`
        );
        res.json(updateUser.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    case "DELETE":
      try {
        const id = req.query.id;
        const deleteUser = await pool.query(
          "DELETE FROM users WHERE user_id = ($1) RETURNING *",
          [parseInt(id)]
        );
        console.log(deleteUser.rows[0], "user deleted");
        res.json(deleteUser.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    default:
      res.status(405);
  }
}
