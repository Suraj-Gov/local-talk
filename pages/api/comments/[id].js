import pool from "../../../lib/db";

export default async function CommentHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const post_id = req.query.id;
        const post_comments = await pool.query(
          "SELECT * FROM comments WHERE comment_post = ($1)",
          [post_id]
        );
        console.log(
          post_comments.rows,
          `got all comments for post: ${post_id}`
        );
        res.json(post_comments.rows);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    case "PUT":
      try {
        const comment_id = req.query.id;
        const { upvote } = req.body;
        if (typeof upvote === "boolean") {
          const upvoteComment = await pool.query(
            upvote
              ? "UPDATE comments SET comment_points = comment_points + 1 WHERE comment_id = ($1) RETURNING *"
              : "UPDATE comments SET comment_points = comment_points - 1 WHERE comment_id = ($1) RETURNING *",
            [comment_id]
          );
          console.log(
            `${upvote ? "upvoted " : "downvoted "}comment: ${comment_id}`
          );
          res.json({ status: upvote ? "upvoted" : "downvoted" });
          return;
        }
        const { comment_content } = req.body;
        const updatedComment = await pool.query(
          "UPDATE comments SET comment_timestamp=now(), comment_content=($1) WHERE comment_id=($2) RETURNING *",
          [comment_content, comment_id]
        );
        console.log(updatedComment.rows[0], `updated comment: ${comment_id}`);
        res.json(updatedComment.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    case "DELETE":
      try {
        const comment_id = req.query.id;
        const deleteComment = await pool.query(
          "DELETE FROM comments WHERE comment_id = ($1) RETURNING *",
          [comment_id]
        );
        console.log(deleteComment.rows[0], `deleted comment: ${comment_id}`);
        res.json({ status: "deleted" });
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    default:
      res.status(405);
      res.json({ status: "error" });
  }
}
