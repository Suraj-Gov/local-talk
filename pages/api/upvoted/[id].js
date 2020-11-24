// USAGE

// PUT is incharge of recording user's upvotes, should specify :id?type="post or comment"&userId=user_id

import pool from "../../../lib/db";

export default async function UpvotedHandle(req, res) {
  const { method } = req;

  switch (method) {
    case "PUT":
      try {
        const id = req.query.id;
        const type = req.query.type;
        const userId = req.query.userId;
        if (type === "post" || type === "comment") {
          const result = await pool.query(
            type === "post"
              ? "UPDATE upvoted SET upvoted_posts = upvoted_posts || ($1) WHERE upvoted_user_id = ($2) RETURNING *"
              : "UPDATE upvoted SET upvoted_comments = upvoted_comments || ($1) WHERE upvoted_user_id = ($2) RETURNING *",
            [id, userId]
          );
          console.log(result.rows, "upvoted comment");
          res.json({ status: "success" });
          return;
        } else {
          res.json({ status: "error" });
        }
      } catch (err) {
        console.log(err);
        res.json({ status: "error", err: err });
        res.status(405);
        return;
      }
    default: {
      res.json({ status: "error" });
      res.status(405);
      return;
    }
  }
}
