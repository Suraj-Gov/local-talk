import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useRef } from "react";
import UserContext from "../../context/UserContext";
import { Points } from "../../components/Icons";
import { PointsButton } from "../../components/PointsButton";
import Link from "next/link";
import Head from "next/head";
import {
  Author_Timestamp,
  Comment,
  CommentContent,
  CommentForm,
  CommentSubmitButton,
  CommentTextInput,
  CommentsContainer,
  EditButtonsDiv,
  ImageContainer,
  LeftDiv,
  UserPicture,
  DescriptionTextArea,
  CommentContentContainer,
} from "../../components/PostComponents";

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
  const [isEditable, setIsEditable] = useState(false);
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setComments(fetchedComments);
    }
    return () => (isMounted = false);
  }, [fetchedComments]);

  const toggleEditable = () => {
    setIsEditable((prev) => !prev);
    if (isEditable) {
      const finalTitle = titleRef.current.value;
      const finalContent = contentRef.current.value;
      const editedPost = {
        post_title: finalTitle.trim(),
        post_content: finalContent.trim(),
        post_altered: true,
        post_id: fetchedPost.post_id,
      };
      const res = axios.put(`/api/posts/${fetchedPost.post_id}`, editedPost);
      if (res.status === "success") {
        router.reload();
      }
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    const newComment = {
      comment_author: userDetails.user_id,
      comment_content: comment.trim(),
      comment_post: fetchedPost.post_id,
    };
    try {
      const sentComment = await axios.post("/api/comments", newComment);
      sentComment.data["user_name"] = userDetails.user_name;
      setComments((prev) => [
        ...prev,
        {
          comment: [sentComment.data],
          upvotes: [null],
          user_details: [userDetails],
        },
      ]);
      setComment("");
    } catch (err) {
      alert("Something went wrong when submitting a comment");
    }
  };

  return error === "ERR" ? (
    <>
      <Head>
        <title>Something went wrong. Please refresh.</title>
      </Head>
      <h1>Something went wrong 😐</h1>
    </>
  ) : router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <Head>
        <title>{fetchedPost.post_title.slice(0, 32) + "..."}</title>
      </Head>
      <article style={{ backgroundColor: "#eee" }}>
        <ImageContainer image={fetchedPost.post_image}>
          {fetchedPost.post_image !== "NO" && (
            <img src={fetchedPost.post_image} />
          )}
          <PostTextArea
            typeRef={titleRef}
            isEditable={isEditable}
            textContent={fetchedPost.post_title}
          ></PostTextArea>
          {userDetails && userDetails.user_id === fetchedPost.post_author && (
            <EditButtonsDiv>
              <button
                name={isEditable ? "Save changes" : "Edit post"}
                onClick={() => toggleEditable()}
              >
                {isEditable ? "Save changes" : "Edit post"}
              </button>
              <button
                name="Delete post"
                onClick={async () => {
                  const canDelete = confirm("Do you want to delete this post?");
                  if (canDelete) {
                    const deletePost = await axios.delete(
                      `/api/posts/${fetchedPost.post_id}`
                    );
                    if (deletePost.status) {
                      router.push("/");
                    }
                  } else return;
                }}
              >
                Delete post
              </button>
              {isEditable && (
                <button name="Cancel edit" onClick={() => setIsEditable(null)}>
                  Cancel edit
                </button>
              )}
            </EditButtonsDiv>
          )}
        </ImageContainer>
        <PostTextArea
          textContent={fetchedPost.post_content}
          isEditable={isEditable}
          typeRef={contentRef}
        ></PostTextArea>
        <CommentsContainer>
          {comments ? (
            comments.map((comment) => {
              return (
                <Comment key={comment.comment[0].comment_id}>
                  <LeftDiv>
                    <UserPicture
                      style={{ borderRadius: "50%" }}
                      src={comment.user_details[0].user_picture}
                    />
                    <Author_Timestamp>
                      <Link href={`/user/${comment.user_details[0].auth0_id}`}>
                        <a>
                          <p
                            style={{ color: "black", display: "inline-block" }}
                          >
                            {comment.user_details[0].user_name}
                          </p>
                        </a>
                      </Link>
                      <p>
                        {getFormattedDate(comment.comment[0].comment_timestamp)}
                      </p>
                    </Author_Timestamp>
                  </LeftDiv>
                  <CommentContentContainer>
                    <CommentContent>
                      {comment.comment[0].comment_content}
                    </CommentContent>
                    <EditButtonsDiv comment={true}>
                      {userDetails.user_name ===
                        comment.user_details[0].user_name && (
                        <button
                          name="Delete post"
                          onClick={async () => {
                            const deletedPost = await axios.delete(
                              `/api/comments/${comment.comment[0].comment_id}`
                            );
                            if (deletedPost.data.status) {
                              router.reload();
                            }
                          }}
                        >
                          Delete comment
                        </button>
                      )}
                    </EditButtonsDiv>
                  </CommentContentContainer>
                  <UpvoteButton
                    style={{
                      position: "absolute",
                      right: "2rem",
                      bottom: "2rem",
                    }}
                    postId={fetchedPost.post_id}
                    data={comment.upvotes}
                    userDetails={userDetails}
                    commentId={comment.comment[0].comment_id}
                  ></UpvoteButton>
                </Comment>
              );
            })
          ) : (
            <h1>Loading Comments</h1>
          )}
          {userDetails ? (
            <>
              <CommentForm>
                <CommentTextInput
                  onKeyUp={(e) => {
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  type="text"
                  placeholder="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <CommentSubmitButton onClick={(e) => submitComment(e)}>
                  Submit comment
                </CommentSubmitButton>
              </CommentForm>
            </>
          ) : (
            <></>
          )}
        </CommentsContainer>
      </article>
    </>
  );
}

export async function getServerSideProps({ params }) {
  let error = null;
  let post,
    comments = null;
  const { id } = params;
  const fetchPost = axios.get(
    `${
      process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_LOCALBASE_URL
        : process.env.NEXT_PUBLIC_VERCEL_URL
    }/api/posts/${id}`
  );
  const fetchComments = axios.get(
    `${
      process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_LOCALBASE_URL
        : process.env.NEXT_PUBLIC_VERCEL_URL
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
      error: error === null ? "no error" : "ERR",
      fallback: true,
    },
  };
}

function UpvoteButton({ userDetails, data, commentId, postId }) {
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

  async function handlePoints() {
    if (isUpvoted) {
      // undo upvote i.e downvote
      const downvote = {
        upvote: false,
        userId: userDetails.user_id,
        postId: null,
        commentId: commentId,
      };
      try {
        const result = await axios.put(`/api/upvoted/${postId}`, downvote);
        if (result.data.status === "downvoted") {
          setPoints((prev) => prev - 1);
          setIsUpvoted((prev) => !prev);
        } else {
          alert("Something went wrong. Action not recorded");
          return;
        }
      } catch (err) {
        console.error(err, "error");
      }
    } else {
      // upvoting
      const upvote = {
        upvote: true,
        userId: userDetails.user_id,
        postId: null,
        commentId: commentId,
      };
      try {
        const result = await axios.put(`/api/upvoted/${postId}`, upvote);
        if (result.data.status === "upvoted") {
          setPoints((prev) => prev + 1);
          setIsUpvoted((prev) => !prev);
        } else {
          alert("Something went wrong. Action not recorded");
          return;
        }
      } catch (err) {
        console.error(err, "error");
      }
    }
  }

  return (
    <PointsButton
      name="Upvote"
      upvoted={isUpvoted}
      disabled={userDetails === null}
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

function PostTextArea({ typeRef, textContent, isEditable, style }) {
  const [text, setText] = useState(textContent);

  let initialText = "";

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      typeRef.current.style.height = typeRef.current.scrollHeight + "px";
      initialText = textContent;

      if (isEditable === null) {
        setText(initialText);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [isEditable]);

  function handleChange(e) {
    if (isEditable) {
      setText(e.target.value);
    }
  }

  return (
    <DescriptionTextArea
      onKeyUp={(e) => {
        style && window.scrollBy(0, e.target.scrollHeight);
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
      contentEditable={isEditable}
      ref={typeRef}
      style={{ caretColor: !isEditable && "transparent", ...style }}
      value={text}
      onChange={(e) => handleChange(e)}
    ></DescriptionTextArea>
  );
}
