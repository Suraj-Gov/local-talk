import { Auth0Provider } from "@auth0/auth0-react";
import { useState } from "react";
import "../styles/globals.css";
import { UserContext } from "./context/userContext";
import { PostsContext } from "./context/PostsContext";
import { UpvotedContext } from "./context/UpvotedContext";

function MyApp({ Component, pageProps }) {
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState(null);
  const [upvoted, setUpvoted] = useState(null);

  return (
    <Auth0Provider
      domain="local-talk.eu.auth0.com"
      clientId="GdqECeXLVVFQEqGguYudRl32GA8bpe06"
      redirectUri="http://localhost:3000"
    >
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        <PostsContext.Provider value={{ posts, setPosts }}>
          <UpvotedContext.Provider value={{ upvoted, setUpvoted }}>
            <Component {...pageProps} />
          </UpvotedContext.Provider>
        </PostsContext.Provider>
      </UserContext.Provider>
    </Auth0Provider>
  );
}

export default MyApp;
