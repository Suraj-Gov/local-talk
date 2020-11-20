import { Auth0Provider } from "@auth0/auth0-react";
import { useState } from "react";
import App from "./App";

export default function Home() {
  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_DOMAIN}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
      redirectUri={process.env.NEXT_PUBLIC_REDIRECTURI}
    >
      <App />
    </Auth0Provider>
  );
}
