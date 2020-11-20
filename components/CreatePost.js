export default function CreatePost() {
  return (
    <form>
      <input
        style={{ display: "block" }}
        type="text"
        value={postTitle}
        maxLength="255"
        placeholder="post_title"
        onChange={(e) => {
          setPostTitle(e.target.value);
        }}
      />
      <textarea
        style={{ display: "block" }}
        placeholder="post_content"
        value={postContent}
        onChange={(e) => {
          setPostContent(e.target.value);
        }}
      ></textarea>
      <button onClick={submitPost}>Create Post</button>
    </form>
  );
}
