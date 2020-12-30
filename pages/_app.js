import { Auth0Provider } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import UserContext from "../context/UserContext";
import PostsContext from "../context/PostsContext";
import UpvotedContext from "../context/UpvotedContext";
import NProgress from "nprogress";
import Router from "next/router";
import Head from "next/head";

NProgress.configure({
  minimum: 0.3,
  easing: "cubic-bezier(0.7, 0, 0.84, 0)",
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

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails !== null) {
      setUserDetails(userDetails);
    }
  }, []);

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      redirectUri={
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_VERCEL_URL
          : process.env.NEXT_PUBLIC_LOCALBASE_URL
      }
      cacheLocation="localstorage"
    >
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        <PostsContext.Provider value={{ posts, setPosts }}>
          <UpvotedContext.Provider value={{ upvoted, setUpvoted }}>
            <Head>
              <meta
                name="viewport"
                content="initial-scale=1.0, width=device-width"
                lang="en"
              />
            </Head>
            <Component {...pageProps} />
          </UpvotedContext.Provider>
        </PostsContext.Provider>
      </UserContext.Provider>
    </Auth0Provider>
  );
}

export default MyApp;
