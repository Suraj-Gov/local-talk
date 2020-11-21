import { useRouter } from "next/router";

export default function User() {
  const router = useRouter();

  return <h1>Hello {router.query.id}</h1>;
}
