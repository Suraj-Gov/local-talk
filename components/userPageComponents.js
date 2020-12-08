import styled from "styled-components";

export const UserContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-bottom: 5rem;
  h1 {
    margin-left: 2rem;
  }
  img {
    border-radius: 50%;
  }
  @media only screen and (max-width: 600px) {
    flex-direction: column;
    h1 {
      margin-top: 2rem;
      margin-left: 0;
    }
  }
`;
