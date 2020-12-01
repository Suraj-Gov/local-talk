// USAGE

import knex from "../../../lib/db";

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
                ? await knex.raw(
                    "INSERT INTO upvoted (upvoted_user_id, upvoted_comment) VALUES (?, ?) RETURNING *",
                    [userId, commentId]
                  )
                : await knex.raw(
                    "INSERT INTO upvoted (upvoted_user_id, upvoted_post) VALUES (?, ?) RETURNING *",
                    [userId, postId]
                  );
            console.log(up, "upvoted");
          } else {
            const down =
              postId === null
                ? await knex.raw(
                    "DELETE FROM upvoted WHERE upvoted_user_id = (?) AND upvoted_comment = (?) AND upvoted_post IS NULL",
                    [userId, commentId]
                  )
                : await knex.raw(
                    "DELETE FROM upvoted WHERE upvoted_user_id = (?) AND upvoted_post = (?) AND upvoted_comment IS NULL",
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
        const putPost = await knex.raw(
          "UPDATE posts SET post_timestamp=now(), post_title=(?), post_content=(?), post_altered=(?) where post_id = (?) RETURNING *",
          [post_title, post_content, post_altered, parseInt(post_id)]
        );
        console.log(putPost);
        console.log(putPost.rows[0], `updated post: ${post_id}`);
        res.json(putPost.rows[0]);
      } catch (error) {
        console.log(error);
        res.status(405);
        res.json({ status: error, error: error });
      }
      break;

    default: {
      res.json({ status: "error" });
      res.status(405);
      return;
    }
  }
}
