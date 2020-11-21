import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";

export default function Post({
  post: fetchedPost,
  comments: fetchedComments,
  error,
}) {
  const [comments, setComments] = useState(fetchedComments);
  const [comment, setComment] = useState("");
  const { userDetails } = useContext(UserContext);

  const submitComment = async (e) => {
    e.preventDefault();
    const newComment = {
      comment_author: userDetails.user_id,
      comment_content: comment,
      comment_post: fetchedPost.post_id,
    };
    const sentComment = await axios.post("/api/comments", newComment);
    setComments((prev) => [...prev, sentComment.data]);
    setComment("");
  };

  return error === "ERR" ? (
    <pre>{JSON.stringify(error)}</pre>
  ) : (
    <>
      <pre>{JSON.stringify(fetchedPost, null, 2)}</pre>
      <hr></hr>
      <pre>{JSON.stringify(comments, null, 2)}</pre>
      <hr></hr>
      {userDetails ? (
        <>
          <form>
            <input
              type="text"
              placeholder="addcomment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button onClick={(e) => submitComment(e)}>Submit comment</button>
          </form>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export async function getServerSideProps({ params }) {
  let error = null;
  let post,
    comments = null;
  const { id } = params;
  console.log(id);
  const fetchPost = axios.get(
    `${
      process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_LOCALBASE_URL
        : process.env.NEXT_PUBLIC_PRODBASE_URL
    }/api/posts/${id}`
  );
  const fetchComments = axios.get(
    `${
      process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_LOCALBASE_URL
        : process.env.NEXT_PUBLIC_PRODBASE_URL
    }/api/comments/${id}`
  );
  await axios
    .all([fetchPost, fetchComments])
    .then(
      axios.spread((...responses) => {
        post = responses[0].data;
        comments = responses[1].data;
      })
    )
    .catch((error) => {
      error = error;
    });

  console.log(error);

  return {
    props: {
      post: post === undefined ? "ERR" : post,
      comments: comments === undefined ? "ERR" : comments,
      error: error === null ? "no error" : "ERR",
    },
  };
}
