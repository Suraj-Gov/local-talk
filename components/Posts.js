import Link from "next/link";
import { useRouter } from "next/router";

export default function Posts({ posts }) {
  return (
    <div>
      {posts.map((post) => {
        return (
          <div key={post.post_id}>
            <Link href={`/posts/${post.post_id}`}>
              <a key={post.post_id}>
                <pre key={post.post_id}>{JSON.stringify(post)}</pre>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
