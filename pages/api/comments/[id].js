// USAGE

// GET :post_id to get single post's comments
// PUT :comment_id to update comment needs - comment_content
// PUT :comment_id to upvote needs - upvote: true
// PUT :comment_id to downvote needs - upvote: false
// DELETE :comment_id to delete commment

import db from "../../../lib/db";

export default async function CommentHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const post_id = req.query.id;
        const post_comments = await db.query(
          "SELECT json_agg(c) AS comment, json_agg(u2) as user_details, json_agg(u) AS upvotes FROM comments c LEFT JOIN upvoted u ON c.comment_id = u.upvoted_comment INNER JOIN posts p ON c.comment_post = p.post_id LEFT JOIN users u2 ON comment_author = u2.user_id WHERE post_id = ($1) GROUP BY comment_id, u2",
          [post_id]
        );
        console.log(
          post_comments.rows,
          `got all comments for post: ${post_id}`
        );
        res.json(post_comments.rows);
      } catch (error) {
        console.log(error);
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    case "DELETE":
      try {
        const comment_id = req.query.id;
        const deleteComment = await db.query(
          "DELETE FROM comments WHERE comment_id = ($1) RETURNING *",
          [comment_id]
        );
        console.log(deleteComment.rows[0], `deleted comment: ${comment_id}`);
        res.json({ status: true });
      } catch (error) {
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    default:
      res.status(405);
      res.json({ status: "error" });
      break;
  }
}
