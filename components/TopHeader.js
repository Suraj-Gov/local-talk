import styled from "styled-components";

export const LocalTalkLeftIcon = styled.h3`
  svg {
    fill: white;
  }
  display: inline-block;
  margin: 0;
  padding: 0.6em 0.85em;
  border-radius: 8px;
  background-color: black;
  font-size: 1.3em;
  text-decoration: none;
  color: white;
  a {
    font-weight: 700;
    color: white;
  }
  span {
    display: flex;
    flex-direction: row;
    align-items: center;

    svg {
      width: 1.5em;
      margin-right: 0.5rem;
    }
  }
`;

export const HandleUserLoginContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2em;
`;

export const NaviButton = styled.button`
  color: black;
  border: none;
  font-size: 1.2em;
  background-color: #eeeeee;
  border: 2px solid #dedede;
  border-radius: 8px;
  padding: 0.3em 0.85em;
  font-family: "Inter", sans-serif;
  cursor: pointer;

  a {
    display: flex;
    flex-direction: row;
    color: black;
  }

  svg {
    fill: black;
    width: 1em;
    margin-right: 0.5em;
  }
`;

export const NaviButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  & > * {
    margin: 0 0.3em;
  }
  span {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;
