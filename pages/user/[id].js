import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "../../context/UserContext";

export default function User({ user, error }) {
  const { logout } = useAuth0();
  const { setUserDetails } = useContext(UserContext);
  const router = useRouter();

  return error === "ERR" ? (
    <h1>Error</h1>
  ) : router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <div>
      <button
        onClick={() => {
          logout();
          setUserDetails(null);
        }}
      >
        Logout
      </button>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  let error = null;
  let user = null;
  const { id } = params;
  const fetchUser = await Axios.get(
    `${
      process.env.NODE_ENV !== "production"
        ? process.env.NEXT_PUBLIC_LOCALBASE_URL
        : process.env.NEXT_PUBLIC_VERCEL_URL
    }/api/users/${id}?all=1`
  );
  user = fetchUser.data;
  console.log(error);

  return {
    props: {
      user: user,
      error: error === null ? "no error" : "ERR",
      fallback: true,
    },
  };
}
