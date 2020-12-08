import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect } from "react";
import UserContext from "../context/UserContext";
import Link from "next/link";
import {
  LocalTalkLeftIcon,
  NaviButton,
  HandleUserLoginContainer,
  NaviButtonsContainer,
} from "../components/TopHeader";
import { Location, ProfileSvg } from "../components/Icons";

export default function HandleUserLogin() {
  const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();

  const { userDetails, setUserDetails } = useContext(UserContext);

  const handleLoginFetch = async (user) => {
    // if (userDetails) {
    //   return;
    // }
    let profile = {};

    await navigator.geolocation.getCurrentPosition(
      async (position) => {
        // success location
        const lat = await position.coords.latitude;
        const long = await position.coords.longitude;
        const userLocationFetch = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`
        );
        const userCity = userLocationFetch.data.address.city;
        const userLocation = await axios.get(`/api/locations/${userCity}`);
        if (userLocation.data.message === "location not found") {
          const newLocation = {
            city: userCity,
          };
          const sendNewLocation = await axios.post(
            `/api/locations`,
            newLocation
          );
          profile = { ...profile, ...sendNewLocation };
        } else {
          profile = { ...profile, ...userLocation.data };
        }
        setUserDetails({ ...userDetails, ...profile });
      },

      async () => {
        // fail location
        const defaultUserLocation = {
          city: "NO_CITY",
        };
        profile = { ...profile, ...defaultUserLocation };
        setUserDetails({ ...userDetails, ...profile });
      }
    );

    const data = await axios.get(`/api/users/${user.sub}`);
    if (data.data.message === "user not found") {
      const newUser = {
        auth0_id: user.sub,
        user_name: user.nickname,
        user_email: user.email,
        user_picture: user.picture,
      };
      await axios.post(`/api/users`, newUser);
      profile = { ...profile, ...newUser };
    } else {
      profile = { ...profile, ...data.data };
    }
    setUserDetails({ ...userDetails, ...profile });
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      user === undefined ? {} : handleLoginFetch(user);
    }
    return () => {
      isMounted = false;
    };
  }, [isLoading]);

  return (
    <HandleUserLoginContainer>
      <LocalTalkLeftIcon>
        <Link href="/">
          <a>LocalTalk</a>
        </Link>
      </LocalTalkLeftIcon>

      {!userDetails ? (
        <LoginButton
          loginWithRedirect={loginWithRedirect}
          isLoading={isLoading}
          user={user}
        />
      ) : (
        <NaviButtonsContainer>
          <NaviButton>
            <Link href={`/user/${userDetails.auth0_id}`}>
              <a>
                <span>
                  {<ProfileSvg />}
                  <p>Profile</p>
                </span>
              </a>
            </Link>
          </NaviButton>
          <NaviButton style={{ display: "none" }}>
            <span>
              {<Location />}
              {userDetails.city}
            </span>
          </NaviButton>
        </NaviButtonsContainer>
      )}
    </HandleUserLoginContainer>
  );
}

function LoginButton({ user, isLoading, loginWithRedirect, userDetails }) {
  // return !user && isLoading ? (
  //   <NaviButton>Loading</NaviButton>
  // ) : (
  //   <NaviButton
  //     onClick={() => {
  //       try {
  //         loginWithRedirect();
  //       } catch (err) {
  //         alert(err);
  //       }
  //     }}
  //   >
  //     Log in
  //   </NaviButton>
  // );

  return (
    <NaviButton
      onClick={() => {
        try {
          loginWithRedirect();
        } catch (err) {
          alert(err);
        }
      }}
    >
      Log in
    </NaviButton>
  );
}
