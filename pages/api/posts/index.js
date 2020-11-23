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
        console.log(city);
        const posts = await pool.query(
          "SELECT * FROM posts INNER JOIN users u ON posts.post_author = u.user_id INNER JOIN locations l ON posts.post_location = l.location_id WHERE city = ($1)",
          [city]
        );
        console.log(posts.rows, "got all these for posts");
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
        } = req.body;
        const newPost = await pool.query(
          "INSERT INTO posts (post_title, post_content, post_author, post_location) VALUES ($1, $2, $3, $4) RETURNING *",
          [post_title, post_content, post_author, post_location]
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
