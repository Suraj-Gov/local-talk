import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./context/userContext";

export default function Posts() {
  const { userDetails } = useContext(UserContext);

  const [allPosts, setAllPosts] = useState([]);

  useEffect(async () => {
    if (userDetails != null && userDetails.city !== undefined) {
      const fetchAllPosts = await axios.get(
        `/api/posts?city=${userDetails.city}`
      );
      setAllPosts(fetchAllPosts.data);
    }
  }, [userDetails]);

  return allPosts.length === 0 ? (
    <h1>Loading</h1>
  ) : (
    <ul>
      {console.log(allPosts)}
      {allPosts.map((post) => {
        return <pre key={post.post_id}>{JSON.stringify(post)}</pre>;
      })}
    </ul>
  );
}
