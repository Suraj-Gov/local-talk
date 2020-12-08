import styled from "styled-components";

export const ImageContainer = styled.div`
  /* https://css-tricks.com/apply-a-filter-to-a-background-image/ */
  //module
  display: grid;
  place-content: center;
  position: relative;
  height: 80vh;
  width: 100%;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${(props) =>
      props.image === "NO" || (props.image === "" && "#D56E6E")};
    background-image: url(${(props) => props.image});
    filter: blur(3px) saturate(180%);
    background-size: cover;
    transform: scale(1.02);
    width: 100%;
    height: 100%;
  }

  img {
    //module-inside
    position: relative;
    width: auto;
    height: inherit;
  }

  textarea {
    font-family: "Inter", sans-serif;
    border: none;
    z-index: 150;
    font-weight: 600;
    text-shadow: 0px 0px 10px #00000077;
    color: #eeeeee;
    background-color: transparent;
    font-size: 2.8em;
    width: 100%;
    position: absolute;
    bottom: 0;
    overflow: hidden;
    padding: 4.5rem;
    resize: none;
    outline: none;

    &::placeholder {
      color: #ffffff88;
    }
  }
`;

export const CommentsContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  padding: 10rem;
`;

export const Comment = styled.div`
  position: relative;
  margin: 3rem 0;
  padding: 2rem;
  background-color: #f8f8f8;
  border-radius: 10px;
  box-shadow: 10px 10px 20px #12121211;
  display: flex;
  flex-direction: row;
`;

export const Author_Timestamp = styled.div`
  align-self: flex-start;
  text-align: center;
  padding-top: 3rem;
  & *:nth-child(1) {
    padding-bottom: 0.5rem;
    font-weight: 600;
  }
  & *:nth-child(2) {
    font-weight: 300;
    color: #454545;
  }
`;

export const CommentContent = styled.p`
  line-height: 1.5em;
  font-weight: 500;
  font-size: 1.4em;
`;

export const CommentForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0 1rem;
`;

export const CommentSubmitButton = styled.button`
  color: #000000;
  border: none;
  padding: 10px;
  background-color: #eeeeee;
  border-radius: 8px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  font-size: 1.2em;
  background-color: #dddddd;
  margin-left: 2rem;
`;

export const CommentTextInput = styled.textarea`
  width: 100%;
  font-family: "Inter", sans-serif;
  line-height: 1.2em;
  font-size: 1.2em;
  outline: none;
  border: none;
  resize: none;
  padding: 1rem;
  min-height: 5rem;
  border-radius: 10px;
  height: fit-content;
  box-shadow: 10px 10px 20px #12121211;
`;

export const EditButtonsDiv = styled.div`
  display: flex;
  position: ${(props) => (props.comment ? "" : "absolute")};
  margin-top: ${(props) => (props.comment ? "1rem" : "")};
  flex-direction: row;
  z-index: 200;
  bottom: 1rem;
  left: 4.5rem;

  button {
    display: inline-block;
    background-color: #000000aa;
    color: white;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    padding: 0.5rem;
    font-size: 0.8em;
    border: none;
    outline: none;
    border-radius: 5px;
    margin-right: 1rem;

    &:hover {
      cursor: pointer;
    }
  }
`;

export const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: "9em";
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 9em;
`;

export const UserPicture = styled.img`
  border-radius: 50%;
`;
