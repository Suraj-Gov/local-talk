import { Auth0Provider } from "@auth0/auth0-react";
import { useState } from "react";
import "../styles/globals.css";
import UserContext from "../context/UserContext";
import PostsContext from "../context/PostsContext";
import UpvotedContext from "../context/UpvotedContext";
import NProgress from "nprogress";
import Router from "next/router";

NProgress.configure({
  minimum: 0.3,
  easing: "easeOutQuad",
  speed: 800,
  showSpinner: true,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const [userDetails, setUserDetails] = useState(null);
  const [posts, setPosts] = useState(null);
  const [upvoted, setUpvoted] = useState(null);

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      redirectUri={
        process.env.NODE_ENV !== "production"
          ? process.env.NEXT_PUBLIC_LOCALBASE_URL
          : process.env.NEXT_PUBLIC_VERCEL_URL
      }
      cacheLocation="localstorage"
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
