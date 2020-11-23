import Axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/userContext";
import { PostsContext } from "./context/PostsContext";
import HandleUserLogin from "./HandleUserLogin";
import Posts from "../components/Posts";
import Link from "next/link";

export default function App() {
  const [errorInPost, setErrorInPosts] = useState();
  const { userDetails } = useContext(UserContext);
  const { posts: postsContext, setPosts: setPostsContext } = useContext(
    PostsContext
  );

  useEffect(async () => {
    if (userDetails && userDetails.city !== undefined) {
      try {
        const posts = await Axios.get(`/api/posts?city=${userDetails.city}`);
        setPostsContext(posts.data);
      } catch (error) {
        setErrorInPosts(error);
      }
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
            <button>MAKE A POST</button>
          </a>
        </Link>
      )}
    </>
  );
}
