// USAGE

// GET gets all upvotes for userId, should specify it with posts=all or post=postID

import pool from "../../../lib/db";

export default async function UpvotedHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const userId = req.query.userId;
        if (userId !== undefined) {
          const result = await pool.query(
            "SELECT upvoted_posts, upvoted_comments FROM upvoted WHERE upvoted_user_id = ($1)",
            [userId]
          );
          if (result.rows.length === 0) {
            res.json({ status: "no user found" });
            res.status(405);
            return;
          }
          res.json(result.rows[0]);
          return;
        } else {
          res.json({ status: "user id not found" });
          res.status(405);
          return;
        }
      } catch (err) {
        console.error(err);
        res.json({ status: "error", error: error });
        res.status(405);
      }
    default: {
      res.json({ status: "error" });
      res.status(405);
      return;
    }
  }
}
