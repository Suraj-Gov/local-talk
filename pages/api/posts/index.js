// USAGE

// GET gets all posts from city needs a url query - city
// POST adds a single post needs - post_title, post_content, post_author, post_location

import pool from "../../../lib/db";

export default async function PostsHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const city = req.query.city;
        const offset = req.query.offset;
        console.log(offset);
        const posts = await pool.query(
          "SELECT * FROM posts INNER JOIN users u ON posts.post_author = u.user_id INNER JOIN locations l ON posts.post_location = l.location_id WHERE city = ($1) OFFSET($2) LIMIT 10",
          [city, offset]
        );
        console.log(posts.rows.length, "got these for posts");
        res.json(posts.rows);
      } catch (error) {
        res.status(405);
        res.json({ status: "error" });
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
        const newPost = await pool.query(
          "INSERT INTO posts (post_title, post_content, post_author, post_location, post_image) VALUES ($1, $2, $3, $4, $5) RETURNING *",
          [post_title, post_content, post_author, post_location, post_image]
        );
        console.log(newPost.rows[0], "inserted new post to db");
        res.json(newPost.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(405);
        res.json({ status: "error" });
      }

    default:
      res.status(405);
  }
}
