import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/userContext";
import HandleUserLogin from "./HandleUserLogin";
import Posts from "./Posts";

export default function App() {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);

  useEffect(() => {
    console.log(userDetails, "userdetails");
  }, [userDetails]);

  return (
    <>
      <HandleUserLogin />
      <h1>Posts</h1>
      <Posts />
      {/* <Link href="/new-post"> */}
      {/* <a> */}
      {userDetails ? (
        <button onClick={() => router.push("/new-post")}>Add post</button>
      ) : (
        <></>
      )}

      {/* </a> */}
      {/* </Link> */}
    </>
  );
}
