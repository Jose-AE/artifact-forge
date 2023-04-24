import { Button } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginButton() {
  function logout() {
    axios
      .get(import.meta.env.VITE_API_URI + "/user/logout", {
        withCredentials: true,
      })
      .then((res) => {
        //console.log(res);
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
          //console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      <Button onClick={() => login()}>Sign in with Google</Button>
      <Button onClick={logout}>Logout</Button>
    </>
  );
}
