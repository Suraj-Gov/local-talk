import Axios from "axios";

export default function User({ user, error }) {
  return error === "ERR" ? (
    <h1>Error</h1>
  ) : (
    <div>
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
        : process.env.NEXT_PUBLIC_PRODBASE_URL
    }/api/users/${id}?all=1`
  );
  user = fetchUser.data;
  console.log(error);

  return {
    props: {
      user: user,
      error: error === null ? "no error" : "ERR",
    },
  };
}
