import Link from "next/link";
import styled from "styled-components";
import { PointsButton } from "./PointsButton";
import { Points } from "../components/Icons";
import { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import Axios from "axios";

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 85vw;
  margin: 2em auto;
  grid-gap: 6rem;
  padding-bottom: 10rem;

  @media only screen and (max-width: 600px) {
    margin: 0;
    width: 100%;
    display: block;
    padding: 1rem;
  }

  @media only screen and (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const PostContainer = styled.div`
  position: relative;
  box-shadow: 10px 10px 10px rgba(147, 147, 147, 0.2);
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  flex-direction: column;
  background-color: #f5f5f5;
  a {
    color: black;
  }
  &:hover {
    box-shadow: 4px 4px 29px rgba(47, 47, 47, 0.35);
  }
  &:active {
    transform: translateX(5px) translateY(5px);
  }
  transition: all 0.2s;

  @media only screen and (max-width: 600px) {
    margin: 3rem 0;
    &:active {
      transform: none;
    }
  }
`;

const ImageContainer = styled.div`
  /* https://css-tricks.com/apply-a-filter-to-a-background-image/ */
  //module
  display: grid;
  place-items: center;
  position: relative;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 15em;
  width: 100%;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${(props) => props.image === "NO" && "#D56E6E"};
    background-image: url(${(props) => props.image !== "NO" && props.image});
    filter: blur(3px) saturate(180%);
    background-size: cover;
    transform: scale(1.1);
    width: 100%;
    height: 100%;
  }

  img {
    //module-inside
    position: relative;
    width: auto;
    height: inherit;
  }
`;

const PostWords = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  padding: 1.5em;
  // if anything wanky happens, remove the height
  height: 55%;
`;

const TitleContent = styled.div`
  display: flex;
  flex-direction: column;

  p {
    margin-top: 0.6em;
    font-weight: 500;
  }
  h3 {
    font-size: 1.4em;
    margin: 0;
  }
`;

const PostAction = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: end;
  margin-top: 1em;
`;

const PostDetails = styled.div`
  a {
    font-weight: 600;
    font-size: 1.2em;
    margin: 0;
  }
  p {
    font-size: 0.9em;
    font-weight: 300;
    margin-top: 0.3em;
  }
`;

function getFormattedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getUTCDate();
  const dayOrdinal = `${
    day +
    (day > 0
      ? ["th", "st", "nd", "rd"][
          (day > 3 && day < 21) || day % 10 > 3 ? 0 : day % 10
        ]
      : "")
  }`;
  return `${dayOrdinal} ${month}, ${year}`;
}

export default function Posts({ posts }) {
  return posts.loading ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Loading...</h1>
    </div>
  ) : posts.length > 0 ? (
    <PostsContainer>
      {posts.map((post) => {
        return (
          <PostContainer key={post.post_details.post_id}>
            <ImageContainer image={post.post_details.post_image}>
              {post.post_details.post_image !== "NO" && (
                <img src={post.post_details.post_image} />
              )}
            </ImageContainer>
            <PostWords>
              <Link href={`/posts/${post.post_details.post_id}`}>
                <a>
                  <TitleContent>
                    <h3>{post.post_details.post_title}</h3>
                    <p>{`${post.post_details.post_content.slice(0, 128)}${
                      post.post_details.post_content.length > 128 ? "..." : ""
                    }`}</p>
                  </TitleContent>
                </a>
              </Link>
              <PostAction>
                <PostDetails>
                  {post.user_details && (
                    <Link href={`/user/${post.user_details.auth0_id}`}>
                      <a>{post.user_details.user_name}</a>
                    </Link>
                  )}
                  <p>{getFormattedDate(post.post_details.post_timestamp)}</p>
                </PostDetails>
                {post.upvotes && (
                  <UpvoteButton
                    postId={post.post_details.post_id}
                    data={post.upvotes}
                  ></UpvoteButton>
                )}
              </PostAction>
            </PostWords>
          </PostContainer>
        );
      })}
    </PostsContainer>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        No posts to show, create a new post!
      </h1>
    </div>
  );
}

function UpvoteButton({ postId, data }) {
  const { userDetails } = useContext(UserContext);
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
        postId: postId,
        commentId: null,
      };
      try {
        const result = await Axios.put(`/api/upvoted/${postId}`, downvote);
        if (result.data.status === "downvoted") {
          setPoints((prev) => prev - 1);
          setIsUpvoted((prev) => !prev);
        } else {
          alert("Something went wrong. Action not recorded");
          return;
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // upvoting
      const upvote = {
        upvote: true,
        userId: userDetails.user_id,
        postId: postId,
        commentId: null,
      };
      try {
        const result = await Axios.put(`/api/upvoted/${postId}`, upvote);
        if (result.data.status === "upvoted") {
          setPoints((prev) => prev + 1);
          setIsUpvoted((prev) => !prev);
        } else {
          alert("Something went wrong. Action not recorded");
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <PointsButton upvoted={isUpvoted} onClick={() => handlePoints()}>
      <span>
        {<Points />}
        <p>{points}</p>
      </span>
    </PointsButton>
  );
}
