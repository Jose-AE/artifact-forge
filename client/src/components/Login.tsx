import { Button } from "@chakra-ui/react";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });

  return <Button onClick={() => login()}>Sign in with Google</Button>;
}
