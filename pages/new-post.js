import Axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import UserContext from "../context/UserContext";

export default function newPost() {
  const { userDetails } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const router = useRouter();

  async function submitPost(e) {
    e.preventDefault();
    if (imageURL.slice(0, 28) === "https://unsplash.com/photos/") {
      const getImageURL = await Axios.get(
        `https://api.unsplash.com/photos/${imageURL.slice(28)}?client_id=${
          process.env.NEXT_PUBLIC_UNSPLASH_KEY
        }`
      );
      const newPost = {
        post_title: title,
        post_content: content,
        post_author: userDetails.user_id,
        post_location: userDetails.location_id,
        post_author_auth0_id: userDetails.sub,
        post_image: getImageURL.data.urls.regular,
      };
      const sendPost = await Axios.post(`/api/posts`, newPost);
      router.replace(`/posts/${sendPost.data.post_id}`);
    } else {
      alert("Not a valid Unsplash link. Please copy & paste the exact URL.");
      return;
    }
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
        <textarea
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder="image url"
        ></textarea>
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
