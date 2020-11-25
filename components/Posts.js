import Link from "next/link";
import styled from "styled-components";
import { PointsButton } from "./PointsButton";
import { Points } from "../components/Icons";
import { UpvotedContext } from "../pages/context/UpvotedContext";
import { useContext, useEffect } from "react";
import Axios from "axios";

const PostsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 85vw;
  margin: 2em auto;
  grid-gap: 6rem;
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
    background-image: url(${(props) => props.image});
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
  const { upvoted } = useContext(UpvotedContext);

  return posts.length > 0 ? (
    <PostsContainer>
      {posts.map((post) => {
        return (
          <PostContainer key={post.post_id}>
            <ImageContainer image={post.post_image}>
              <img src={post.post_image} />
            </ImageContainer>
            <PostWords>
              <Link href={`/posts/${post.post_id}`} key={post.post_id}>
                <a>
                  <TitleContent>
                    <h3 onChange={() => console.log("changed")}>
                      {post.post_title}
                    </h3>
                    <p>{`${post.post_content.slice(0, 128)}${
                      post.post_content.length > 128 ? "..." : ""
                    }`}</p>
                  </TitleContent>
                </a>
              </Link>
              <PostAction>
                <PostDetails>
                  <Link href={`/api/users/${post.auth0_id}?all=1`}>
                    <a>{post.user_name}</a>
                  </Link>
                  <p>{getFormattedDate(post.post_timestamp)}</p>
                </PostDetails>
                <PointsButton
                  onClick={() => {}}
                  upvoted={upvoted.upvoted_posts.some(
                    (i) => i === post.post_id
                  )}
                >
                  <span>
                    {<Points />}
                    <p>{post.post_points}</p>
                  </span>
                </PointsButton>
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
      <h1>Loading...</h1>
    </div>
  );
}
