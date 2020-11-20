import { useAuth0 } from "@auth0/auth0-react";
import HandleUserLogin from "./HandleUserLogin";

export default function App() {
  return (
    <>
      <HandleUserLogin />
      <h1>Posts</h1>
    </>
  );
}
