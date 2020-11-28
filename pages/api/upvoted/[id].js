// USAGE

import pool from "../../../lib/db";

export default async function UpvotedHandle(req, res) {
  const { method } = req;

  switch (method) {
    case "PUT":
      try {
        const edit = req.query.edit;
        edit && console.log(edit);
        const post_id = req.query.id;
        const { upvote, userId, postId, commentId } = req.body;
        if (typeof upvote === "boolean") {
          if (upvote) {
            const up =
              postId === null
                ? await pool.query(
                    "INSERT INTO upvoted (upvoted_user_id, upvoted_comment) VALUES ($1, $2) RETURNING *",
                    [userId, commentId]
                  )
                : await pool.query(
                    "INSERT INTO upvoted (upvoted_user_id, upvoted_post) VALUES ($1, $2) RETURNING *",
                    [userId, postId]
                  );
            console.log(up, "upvoted");
          } else {
            const down =
              postId === null
                ? await pool.query(
                    "DELETE FROM upvoted WHERE upvoted_user_id = ($1) AND upvoted_comment = ($2) AND upvoted_post IS NULL",
                    [userId, commentId]
                  )
                : await pool.query(
                    "DELETE FROM upvoted WHERE upvoted_user_id = ($1) AND upvoted_post = ($2) AND upvoted_comment IS NULL",
                    [userId, postId]
                  );
            console.log(down, "downvoted");
          }
          console.log(`${upvote ? "upvoted " : "downvoted "}post: ${post_id}`);
          res.json({ status: upvote ? "upvoted" : "downvoted" });
          return;
        }
        const { post_title, post_content, post_altered } = req.body;
        console.log(req.body);
        const putPost = await pool.query(
          "UPDATE posts SET post_timestamp=now(), post_title=($1), post_content=($2), post_altered=($3) where post_id = ($4) RETURNING *",
          [post_title, post_content, post_altered, parseInt(post_id)]
        );
        console.log(putPost);
        console.log(putPost.rows[0], `updated post: ${post_id}`);
        res.json(putPost.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(405);
        res.json({ status: error });
      }
      break;

    default: {
      res.json({ status: "error" });
      res.status(405);
      return;
    }
  }
}
