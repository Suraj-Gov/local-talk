import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import styled from "styled-components";
import { Points } from "../../components/Icons";
import { PointsButton } from "../../components/PointsButton";
import Link from "next/link";

const ImageContainer = styled.div`
  /* https://css-tricks.com/apply-a-filter-to-a-background-image/ */
  //module
  display: grid;
  place-content: center;
  position: relative;
  height: 80vh;
  width: 100%;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-image: url(${(props) => props.image});
    filter: blur(3px) saturate(180%);
    background-size: cover;
    transform: scale(1.02);
    width: 100%;
    height: 100%;
  }

  img {
    //module-inside
    position: relative;
    width: auto;
    height: inherit;
  }

  h1 {
    font-weight: 600;
    text-shadow: 0px 0px 10px #00000077;
    color: #eeeeee;
    font-size: 2.8em;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 4.5rem;
    padding-bottom: 2rem;
    outline: none;
  }
`;

const PostContent = styled.p`
  background-color: #eeeeee;
  color: #333333;
  font-size: 1.6em;
  width: 100%;
  line-height: 1.6em;
  padding: 4.5rem;
  outline: none;
  //
`;

const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 10rem;
`;

const Comment = styled.div`
  position: relative;
  margin: 3rem 0;
  padding: 2rem;
  background-color: #efefef;
  border-radius: 10px;
  box-shadow: 10px 10px 20px #12121211;
`;

const Author_Timestamp = styled.div`
  padding-top: 3rem;
  & *:nth-child(1) {
    padding-bottom: 0.5rem;
    font-weight: 600;
  }
  & *:nth-child(2) {
    font-weight: 300;
    color: #454545;
  }
`;

const CommentContent = styled.p`
  line-height: 1.5em;
  font-weight: 500;
  font-size: 1.4em;
`;

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const dayOrdinal = `${
    day +
    (day > 0
      ? ["th", "st", "nd", "rd"][
          (day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10
        ]
      : "")
  }`;
  const minute =
    date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes();
  const hour = date.getHours();
  return `${dayOrdinal} ${month}, ${year} | ${hour}:${minute}`;
}

export default function Post({
  post: fetchedPost,
  comments: fetchedComments,
  error,
}) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    setComments(fetchedComments);
  }, [fetchedComments]);

  const submitComment = async (e) => {
    e.preventDefault();
    const newComment = {
      comment_author: userDetails.user_id,
      comment_content: comment,
      comment_post: fetchedPost.post_id,
    };
    const sentComment = await axios.post("/api/comments", newComment);
    sentComment.data["user_name"] = userDetails.user_name;
    setComments((prev) => [...prev, sentComment.data]);
    setComment("");
  };

  return error === "ERR" ? (
    <h1>Something went wrong 😐, please refresh.</h1>
  ) : router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <article style={{ backgroundColor: "#eee" }}>
      <ImageContainer image={fetchedPost.post_image}>
        <img src={fetchedPost.post_image} />
        <h1>{fetchedPost.post_title}</h1>
      </ImageContainer>
      <PostContent>{fetchedPost.post_content}</PostContent>
      <CommentsContainer>
        {comments ? (
          comments.map((comment) => {
            return (
              <Comment key={comment.comment[0].comment_id}>
                <CommentContent>
                  {comment.comment[0].comment_content}
                </CommentContent>
                <Author_Timestamp>
                  <Link href={`/user/${comment.user_details[0].auth0_id}`}>
                    <a>
                      <p style={{ color: "black", display: "inline-block" }}>
                        {comment.user_details[0].user_name}
                      </p>
                    </a>
                  </Link>
                  <p>
                    {getFormattedDate(comment.comment[0].comment_timestamp)}
                  </p>
                </Author_Timestamp>
                <UpvoteButton
                  style={{
                    position: "absolute",
                    right: "2rem",
                    bottom: "2rem",
                  }}
                  data={comment.upvotes}
                  userDetails={userDetails}
                ></UpvoteButton>
              </Comment>
            );
          })
        ) : (
          <h1>Loading Comments</h1>
        )}
      </CommentsContainer>
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
    </article>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    // No pages are built at run time.
    // Enable statically generating additional pages
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
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

  return {
    props: {
      post,
      comments,
      error,
    },
    revalidate: 1,
  };
}

function UpvoteButton({ userDetails, data }) {
  const [points, setPoints] = useState(() =>
    data[0] !== null ? data.length : 0
  );
  const [isUpvoted, setIsUpvoted] = useState(
    userDetails === null
      ? false
      : data.some(
          (upvote) =>
            upvote !== null && upvote.upvoted_user_id === userDetails.user_id
        ) && true
  );

  console.log(isUpvoted);
  // initPoints={
  //   (comment.upvotes.reduce((total, upvote) => {
  //     console.log(upvote, "from comment total calc");
  //     return upvote[0] === null ? total + 0 : total + 1;
  //   }),
  //   0)
  // }
  function handlePoints() {
    console.log("pressed the button!");
  }

  return (
    <PointsButton
      upvoted={isUpvoted}
      style={{
        position: "absolute",
        right: "2rem",
        bottom: "2rem",
      }}
      onClick={() => handlePoints()}
    >
      <span>
        {<Points />}
        <p>{points}</p>
      </span>
    </PointsButton>
  );
}
