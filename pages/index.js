import { Auth0Provider } from "@auth0/auth0-react";
import { useState } from "react";
import App from "./App";
import { UserContext } from "./context/userContext";

export default function Home() {
  const [userDetails, setUserDetails] = useState(null);

  return (
    <Auth0Provider
      domain="local-talk.eu.auth0.com"
      clientId="GdqECeXLVVFQEqGguYudRl32GA8bpe06"
      redirectUri="http://localhost:3000"
    >
      <UserContext.Provider value={{ userDetails, setUserDetails }}>
        <App />
      </UserContext.Provider>
    </Auth0Provider>
  );
}
