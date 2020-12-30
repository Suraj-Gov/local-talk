import App from "./App";
import Head from "next/head";

export default function Home() {
  return (
    // <Auth0Provider
    //   domain={process.env.NEXT_PUBLIC_DOMAIN}
    //   clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
    //   redirectUri={
    //     process.env.NODE_ENV !== "production"
    //       ? process.env.NEXT_PUBLIC_LOCALBASE_URL
    //       : process.env.NEXT_PUBLIC_VERCEL_URL
    //   }
    //   cacheLocation="localstorage"
    // >
    <>
      <Head>
        <title>Home - Local-Talk</title>
      </Head>
      <App />
    </>
    // </Auth0Provider>
  );
}
