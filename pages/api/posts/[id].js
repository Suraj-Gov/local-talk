// USAGE

// GET :post_id gets a single post
// PUT :post_id updates a single post needs - post_title, post_content, post_altered: true
// PUT :post_id upvotes a single post needs - upvote: true
// PUT :post_id downvotes a single post needs - upvote: false
// DELETE :post_id deletes a single post

import pool from "../../../lib/db";

export default async function PostsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const post_id = req.query.id;
        const getPost = await pool.query(
          "SELECT * FROM posts INNER JOIN locations l ON posts.post_location = l.location_id WHERE post_id = ($1)",
          [post_id]
        );
        console.log(getPost.rows[0], `got this for post_id: ${post_id}`);
        res.json(getPost.rows[0]);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;

    case "PUT":
      try {
        const post_id = req.query.id;
        const { upvote } = req.body;
        if (typeof upvote === "boolean") {
          const upvotePost = await pool.query(
            upvote
              ? "UPDATE posts SET post_points = post_points + 1 WHERE post_id = ($1) RETURNING *"
              : "UPDATE posts SET post_points = post_points - 1 WHERE post_id = ($1) RETURNING *",
            [post_id]
          );
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
        res.status(405);
        res.json({ status: error });
      }
      break;

    case "DELETE":
      try {
        const post_id = req.query.id;
        const deletePost = await pool.query(
          "DELETE FROM POSTS WHERE post_id = ($1) RETURNING *",
          [post_id]
        );
        console.log(deletePost.rows[0], `deleted post: ${post_id}`);
        res.json({ status: "deleted" });
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
      }
      break;
  }
}
