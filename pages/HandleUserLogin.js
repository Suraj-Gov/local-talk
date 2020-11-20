import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect } from "react";
import { UserContext } from "./context/userContext";

export default function HandleUserLogin() {
  const {
    loginWithRedirect,
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth0();

  const { userDetails, setUserDetails } = useContext(UserContext);

  const handleLoginFetch = async (user) => {
    let profile = {};
    const data = await axios.get(`/api/users/${user.sub}`);
    if (data.data.message === "user not found") {
      const newUser = {
        auth0_id: user.sub,
        user_name: user.nickname,
        user_email: user.email,
      };
      console.log(newUser, "newUser");
      await axios.post(`/api/users`, newUser);
      console.log("inserted a new user to database");
      profile = { ...newUser, ...profile };
    } else {
      console.log("found existing user", data.data);
      profile = { ...data.data, ...profile };
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // success location
        const lat = await position.coords.latitude;
        const long = await position.coords.longitude;
        console.log("user position", lat, long);
        const userLocationFetch = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`
        );
        const userCity = userLocationFetch.data.address.city;
        const userLocation = await axios.get(`/api/locations/${userCity}`);
        if (userLocation.data.message === "location not found") {
          const newLocation = {
            city: userCity,
          };
          await axios.post(`/api/locations`, newLocation);
          console.log("inserted a new location to database");
          profile = { ...profile, ...newLocation };
        } else {
          console.log("found existing location", userLocation.data);
          profile = { ...profile, ...userLocation.data };
        }

        setUserDetails(profile);
      },

      async () => {
        // fail location
        console.log("failed to get user location");
        const defaultUserLocation = {
          city: "NO_CITY",
        };
        await axios.post(`/api/locations`, newLocation);
        console.log("inserted a new location to database");
        profile = { ...profile, ...defaultUserLocation };
      }
    );
  };

  useEffect(() => {
    user === undefined
      ? console.log("not logged in yet")
      : handleLoginFetch(user);
  }, [isLoading]);

  return (
    <div style={{ backgroundColor: "#eeeeee" }}>
      <h3>Login</h3>
      {isLoading ? (
        <h1>Loading</h1>
      ) : !isAuthenticated ? (
        <LoginButton loginWithRedirect={loginWithRedirect} />
      ) : (
        <LogoutButton logout={logout} />
      )}
      <pre>{isAuthenticated ? JSON.stringify(user) : "not authenticated"}</pre>
      <pre>
        {userDetails === null ? "not yet" : JSON.stringify(userDetails)}
      </pre>
    </div>
  );
}

function LoginButton({ loginWithRedirect }) {
  return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

function LogoutButton({ logout }) {
  return <button onClick={() => logout()}>Log out</button>;
}
