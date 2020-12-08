import styled from "styled-components";

export const PointsButton = styled.button`
  outline: none;
  color: ${(props) => (props.disabled ? "#bbbbbb" : "#000000")};
  border: none;
  padding: 10px;
  background-color: ${(props) => (props.upvoted ? "#ff8080" : "#ffdddd")};
  border-radius: 8px;
  font-weight: 500;
  font-family: "Inter", sans-serif;
  p {
    font-size: 1.5em;
  }
  span {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  svg {
    fill: ${(props) => (props.disabled ? "#bbbbbb" : "#000000")};
    width: 1.5em;
    margin-right: 1em;
  }
  &:hover {
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  }
  &:active {
    transform: translateY(10px);
  }
  transition: all 0.2s ease-in-out;
`;
