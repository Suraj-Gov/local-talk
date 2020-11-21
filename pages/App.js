import Axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/userContext";
import HandleUserLogin from "./HandleUserLogin";
import Posts from "../components/Posts";
import Link from "next/link";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [errorInPost, setErrorInPosts] = useState();
  const router = useRouter();
  const { userDetails } = useContext(UserContext);

  useEffect(async () => {
    if (userDetails && userDetails.city !== undefined) {
      try {
        const posts = await Axios.get(`/api/posts?city=${userDetails.city}`);
        setPosts(posts.data);
      } catch (error) {
        setErrorInPosts(error);
      }
    }
  }, [userDetails]);

  return (
    <>
      <HandleUserLogin />
      <h1>Posts</h1>
      {errorInPost ? (
        <pre>{JSON.stringify(errorInPost, null, 2)}</pre>
      ) : (
        <Posts posts={posts} />
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
