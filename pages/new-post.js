import Axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "./context/userContext";

export default function newPost() {
  const { userDetails } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  async function submitPost(e) {
    e.preventDefault();
    const newPost = {
      post_title: title,
      post_content: content,
      post_author: userDetails.user_id,
      post_location: userDetails.location_id,
    };

    const sendPost = await Axios.post(`/api/posts`, newPost);
    router.replace(`/posts/${sendPost.data.post_id}`);
  }

  return userDetails ? (
    <div>
      <form>
        <h1>Hello, {userDetails.user_name}</h1>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="content"
        />
        <button type="submit" onClick={(e) => submitPost(e)}>
          POST!
        </button>
      </form>
    </div>
  ) : (
    <div>
      <h1>You've not logged in</h1>
      <Link href="/">
        <a>
          <button>GO HOME</button>
        </a>
      </Link>
    </div>
  );
}
