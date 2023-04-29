import { Button } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../App";

export default function LoginButton() {
  const { loggedUser, setLoggedUser } = useContext(LoginContext);

  function logout() {
    axios
      .get(import.meta.env.VITE_API_URI + "/user/logout", {
        withCredentials: true,
      })
      .then((res) => {
        setLoggedUser(null);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      axios
        .post(
          import.meta.env.VITE_API_URI + "/user/login",
          {
            googleAccessToken: tokenResponse.access_token,
          },
          { withCredentials: true }
        )
        .then((res) => {
          console.log(res);
          setLoggedUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      {loggedUser ? (
        <Button onClick={logout}>Logout</Button>
      ) : (
        <Button onClick={() => login()}>Sign in with Google</Button>
      )}
    </>
  );
}
