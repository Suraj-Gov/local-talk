import Axios from "axios";
import { useContext, useState, useEffect } from "react";
import UserContext from "../context/UserContext";
import PostsContext from "../context/PostsContext";
import HandleUserLogin from "./HandleUserLogin";
import Posts from "../components/Posts";
import Link from "next/link";
import styled from "styled-components";

const AddNewPost = styled.button`
  border: none;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background-color: black;
  position: absolute;
  bottom: 5rem;
  right: 5rem;
  padding: 1rem;

  &:hover {
    cursor: pointer;
  }

  svg {
    fill: white;
  }
`;

export default function App() {
  const [errorInPost, setErrorInPosts] = useState();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const [offset, setOffset] = useState(0);
  const { posts: postsContext, setPosts: setPostsContext } = useContext(
    PostsContext
  );

  useEffect(async () => {
    if (userDetails && userDetails.city !== undefined) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      setPostsContext({ loading: true });
      const posts = await Axios.get(
        `/api/posts?city=${userDetails.city}&offset=${offset}`
      );
      // console.log(posts.data);
      const structuredPosts = posts.data.map((post) => {
        return {
          post_details: post.post_details[0],
          user_details: post.user_details[0],
          upvotes: post.upvotes,
        };
      });
      setPostsContext(structuredPosts);
    }
  }, [userDetails]);

  return (
    <>
      <HandleUserLogin />
      {errorInPost || !postsContext ? (
        <pre>{JSON.stringify(errorInPost, null, 2)}</pre>
      ) : (
        <Posts posts={postsContext} />
      )}
      {userDetails && (
        <Link href="/new-post">
          <a>
            <AddNewPost>
              <svg viewBox="0 0 58 59" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.9824 56.0775C21.9824 57.1821 22.8778 58.0775 23.9824 58.0775H34.2347C35.3392 58.0775 36.2347 57.1821 36.2347 56.0775V38.7251C36.2347 37.6205 37.1301 36.7251 38.2347 36.7251H55.2946C56.3992 36.7251 57.2946 35.8297 57.2946 34.7251V24.2749C57.2946 23.1703 56.3992 22.2749 55.2946 22.2749H38.2347C37.1301 22.2749 36.2347 21.3795 36.2347 20.2749V2.92248C36.2347 1.81792 35.3392 0.922485 34.2347 0.922485H23.9824C22.8778 0.922485 21.9824 1.81792 21.9824 2.92249V20.2749C21.9824 21.3795 21.087 22.2749 19.9824 22.2749H2.92248C1.81791 22.2749 0.922485 23.1703 0.922485 24.2749V34.7251C0.922485 35.8297 1.81792 36.7251 2.92249 36.7251H19.9824C21.087 36.7251 21.9824 37.6205 21.9824 38.7251V56.0775Z" />
              </svg>
            </AddNewPost>
          </a>
        </Link>
      )}
    </>
  );
}
