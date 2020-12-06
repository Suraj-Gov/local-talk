import Axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import { ImageContainer, PostButtonsDiv } from "../components/PostComponents";
import UserContext from "../context/UserContext";
import styled from "styled-components";

const ImageInput = styled.input`
  padding: 10px;
  outline: none;
  background-color: #00000036;
  color: white;
  font-size: 1.2em;
  border: none;
  margin: 2em 4.5rem;
  z-index: 150;
  position: absolute;
  top: 4.5rem;
  border-radius: 10px;
`;

export default function newPost() {
  const { userDetails } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const router = useRouter();
  const imageRef = useRef();

  useEffect(async () => {
    if (imageURL.slice(0, 28) === "https://unsplash.com/photos/") {
      console.log(process.env.NEXT_PUBLIC_UNSPLASH_KEY);
      try {
        const getImageURL = await Axios.get(
          `https://api.unsplash.com/photos/${imageURL.slice(28)}?client_id=${
            process.env.NEXT_PUBLIC_UNSPLASH_KEY
          }`
        );
        setImageURL(getImageURL.data.urls.regular);
      } catch (err) {
        if (err.response.status === 404) {
          setImageURL("");
          imageRef.current.value = "";
        }
      }
    }
  }, [imageURL]);

  async function submitPost(e) {
    e.preventDefault();
    const newPost = {
      post_title: title,
      post_content: content,
      post_author: userDetails.user_id,
      post_location: userDetails.location_id,
      post_author_auth0_id: userDetails.sub,
      post_image: imageURL.length === 0 ? "NO" : imageURL,
    };
    const sendPost = await Axios.post(`/api/posts`, newPost);
    router.replace(`/posts/${sendPost.data.post_id}`);
  }

  return userDetails ? (
    <form>
      <article style={{ backgroundColor: "#eeeeee" }}>
        <ImageContainer image={imageURL}>
          {imageURL !== "" && <img src={imageURL} />}

          <textarea
            placeholder={"Title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></textarea>
          <ImageInput
            type="url"
            ref={imageRef}
            onChange={(e) => setImageURL(e.target.value)}
          />
          <PostButtonsDiv>
            {title && (
              <button type="submit" onClick={(e) => submitPost(e)}>
                Save Post
              </button>
            )}
            <button
              onClick={() => router.replace(`/posts/${sendPost.data.post_id}`)}
            >
              Cancel Post
            </button>
          </PostButtonsDiv>
        </ImageContainer>
        <textarea
          placeholder={"Description"}
          onChange={(e) => setContent(e.target.value)}
          onKeyUp={(e) => {
            e.target.style.height = "1px";
            e.target.style.height = `${20 + e.target.scrollHeight}px`;
          }}
          style={{
            border: "none",
            fontFamily: "Inter, sans-serif",
            backgroundColor: "#eeeeee",
            color: "#333333",
            fontSize: "1.6em",
            width: "100%",
            lineHeight: "1.6em",
            padding: "4.5rem",
            outline: "none",
            overflow: "hidden",
          }}
        ></textarea>
      </article>
    </form>
  ) : (
    <center>
      <h1>You've not logged in</h1>
      <Link href="/">
        <a>
          <button>GO HOME</button>
        </a>
      </Link>
    </center>
  );
}
