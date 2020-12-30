// USAGE

// POST add a new comment needs - comment_author, comment_content, comment_post

import pool from "../../../lib/db";

export default async function CommentsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        console.log("adding comment", req.body);
        const { comment_author, comment_content, comment_post } = req.body;
        const newComment = await pool.query(
          "INSERT INTO comments (comment_author, comment_content, comment_post) VALUES ($1, $2, $3) RETURNING *",
          [comment_author, comment_content, comment_post]
        );
        console.log(newComment.rows[0], "inserted new comment to db");
        res.json(newComment.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    default:
      res.status(405);
      res.json({ status: "error" });
  }
  pool.end().then(() => console.log("connection terminated"));
}
