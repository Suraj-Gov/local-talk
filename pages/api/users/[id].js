// USAGE

// GET :auth0_id gets a single user
// PUT :auth0_id upvotes a single user needs - upvote: true
// PUT :auth0_id downvotes a single user needs - upvote: false

const pool = require("../../../lib/db");

export default async function userHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const auth0_id = req.query.id;
        const getUser = await pool.query(
          "SELECT * FROM users WHERE auth0_id = ($1)",
          [auth0_id]
        );
        if (req.query.all === "1") {
          const getPosts = await pool.query(
            "select * from users inner join posts p on users.user_id = p.post_author inner join locations l on p.post_location = l.location_id where auth0_id=($1)",
            [auth0_id]
          );
          const getComments = await pool.query(
            "SELECT * FROM users INNER JOIN comments c ON users.user_id = c.comment_author  WHERE auth0_id=($1)",
            [auth0_id]
          );
          const postsOnly = getPosts.rows.map((post) => {
            return {
              post_id: post.post_id,
              post_title: post.post_title,
              post_content: post.post_content,
              post_timestamp: post.post_timestamp,
              post_points: post.post_points,
              location_id: post.location_id,
              city: post.city,
            };
          });
          const commentsOnly = getComments.rows.map((comment) => {
            return {
              comment_id: comment.comment_id,
              comment_content: comment.comment_content,
              comment_post: comment.comment_post,
              comment_timestamp: comment.comment_timestamp,
              comment_points: comment.comment_points,
            };
          });
          const result = {
            user: getUser.rows,
            posts: postsOnly,
            comments: commentsOnly,
          };
          res.json(result);
          return;
        }
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
        res.json({ status: "error", error: error });
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
        res.json({ status: "error", error: error });
      }
      break;

    default:
      res.status(405);
  }
}
