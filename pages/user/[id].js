import { useAuth0 } from "@auth0/auth0-react";
import Axios from "axios";
import { useRouter } from "next/router";
import { useContext } from "react";
import UserContext from "../../context/UserContext";
import Posts from "../../components/Posts";
import {
  HandleUserLoginContainer,
  LocalTalkLeftIcon,
  NaviButton,
  NaviButtonsContainer,
} from "../../components/TopHeader";
import { ProfileSvg } from "../../components/Icons";
import { UserContainer } from "../../components/userPageComponents";
import {
  Comment,
  CommentContent,
  CommentContentContainer,
  CommentsContainer,
  LeftDiv,
  UserPicture,
} from "../../components/PostComponents";

export default function User({ user, error }) {
  const { logout } = useAuth0();
  const { setUserDetails } = useContext(UserContext);
  const router = useRouter();
  const posts = user.posts.map((post) => {
    return {
      post_details: {
        ...post,
      },
    };
  });

  return error === "ERR" ? (
    <h1>Error</h1>
  ) : router.isFallback ? (
    <h1>Loading...</h1>
  ) : (
    <>
      <HandleUserLoginContainer>
        <NaviButtonsContainer>
          <NaviButton
            onClick={() => {
              logout();
              setUserDetails(null);
              localStorage.removeItem("userDetails");
            }}
          >
            <span>Logout</span>
          </NaviButton>
        </NaviButtonsContainer>
      </HandleUserLoginContainer>
      <div>
        <UserContainer>
          <img src={user.user[0].user_picture} />
          <h1>{user.user[0].user_name}</h1>
        </UserContainer>
        <Posts posts={posts} />
        <CommentsContainer>
          {user.comments ? (
            user.comments.map((comment) => {
              return (
                <Comment key={comment.comment_id}>
                  <LeftDiv
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "9em",
                    }}
                  >
                    <UserPicture
                      style={{ borderRadius: "50%" }}
                      src={user.user[0].user_picture}
                    ></UserPicture>
                  </LeftDiv>
                  <CommentContentContainer>
                    <CommentContent>{comment.comment_content}</CommentContent>
                  </CommentContentContainer>
                </Comment>
              );
            })
          ) : (
            <></>
          )}
          {user.comments.length > 0 && <h1>User Comments</h1>}
        </CommentsContainer>
      </div>
    </>
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
