import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "./context/userContext";

export default function newPost() {
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const router = useRouter();
  const { userDetails } = useContext(UserContext);

  const submitPost = async (e) => {
    e.preventDefault();
    const newPost = {
      post_title: postTitle,
      post_content: postContent,
      post_location: userDetails.location_id,
    };
    const submittedPost = await axios.post(`/api/posts`, newPost);
    if (submittedPost) {
      console.log("success");
      router.push("/");
    }
  };

  return (
    <div>
      <form>
        <input
          style={{ display: "block" }}
          type="text"
          value={postTitle}
          maxLength="255"
          placeholder="post_title"
          onChange={(e) => {
            setPostTitle(e.target.value);
          }}
        />
        <textarea
          style={{ display: "block" }}
          placeholder="post_content"
          value={postContent}
          onChange={(e) => {
            setPostContent(e.target.value);
          }}
        ></textarea>
        <button onClick={(e) => submitPost(e)}>Create Post</button>
      </form>
    </div>
  );
}
