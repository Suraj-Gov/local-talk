import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Post() {
  const router = useRouter();
  const { id } = router;

  useEffect(async () => {}, []);
}
