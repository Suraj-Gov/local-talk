// USAGE

// GET gets all posts from city needs a url query - city
// POST adds a single post needs - post_title, post_content, post_author, post_location

import db from "../../../lib/db";

export default async function PostsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const city = req.query.city;
        const offset = req.query.offset;
        console.log(offset);
        const posts = await db.query(
          "SELECT json_agg(p) AS post_details, json_agg(users) AS user_details, json_agg(u) AS upvotes FROM posts p LEFT JOIN upvoted u ON p.post_id = u.upvoted_post INNER JOIN users ON p.post_author = users.user_id INNER JOIN locations l ON p.post_location = l.location_id WHERE l.city = ($1) GROUP BY p OFFSET($2) LIMIT 9",
          [city, offset]
        );
        console.log(posts.rows.length, "got these for posts");
        res.json(posts.rows);
      } catch (error) {
        res.status(405);
        res.json({ status: "error", error: error });
      }
      break;

    case "POST":
      try {
        const {
          post_title,
          post_content,
          post_author,
          post_location,
          post_image,
        } = req.body;
        const newPost = await db.query(
          "INSERT INTO posts (post_title, post_content, post_author, post_location, post_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [
            post_title,
            post_content,
            post_author,
            post_location ? post_location : 0,
            post_image,
          ]
        );
        console.log(newPost.rows[0], "inserted new post to db");
        res.json(newPost.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(405);
        res.json({ status: "error", error: error });
      }

    default:
      res.status(405);
  }
}
