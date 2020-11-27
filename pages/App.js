import Axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/userContext";
import { PostsContext } from "./context/PostsContext";
import { UpvotedContext } from "./context/UpvotedContext";
import HandleUserLogin from "./HandleUserLogin";
import Posts from "../components/Posts";
import Link from "next/link";

export default function App() {
  const [errorInPost, setErrorInPosts] = useState();
  const { userDetails, setUserDetails } = useContext(UserContext);
  const { upvoted, setUpvoted } = useContext(UpvotedContext);
  const [offset, setOffset] = useState(0);
  const { posts: postsContext, setPosts: setPostsContext } = useContext(
    PostsContext
  );

  useEffect(async () => {
    if (userDetails && userDetails.city !== undefined) {
      try {
        const posts = Axios.get(
          `/api/posts?city=${userDetails.city}&offset=${offset}`
        );
        // const upvoted = Axios.get(`/api/upvoted?userId=${userDetails.user_id}`);
        await Axios.all([posts]).then(
          Axios.spread((...responses) => {
            // setUpvoted(responses[1].data);
            setPostsContext(responses[0].data);
          })
        );
        // console.log(postsContext, "posts");
        // console.log(upvoted.data, "upvoted");
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
