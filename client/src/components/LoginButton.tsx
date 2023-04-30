import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../App";
import { FcGoogle } from "react-icons/fc";
import { Button, Center, Text } from "@chakra-ui/react";

export default function LoginButton() {
  const { loggedUser, setLoggedUser } = useContext(LoginContext);

  function logout() {
    axios
      .post(
        import.meta.env.VITE_API_URI + "/user/logout",
        {},
        {
          withCredentials: true,
        }
      )
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
          console.log(res.data);
          setLoggedUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      <Center>
        <Button onClick={() => login()} w="100%" leftIcon={<FcGoogle />}>
          <Center>
            <Text>Sign in with Google</Text>
          </Center>
        </Button>
        <Button onClick={logout}>logout</Button>
      </Center>
    </>
  );
}
