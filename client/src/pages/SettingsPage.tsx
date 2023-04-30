import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../App";
import { Avatar, Button, Text } from "@chakra-ui/react";
//
export default function SettingsPage() {
  const { loggedUser, setLoggedUser } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = useState(loggedUser == null);

  if (!isLoggedIn) {
    return <Text>not logged in</Text>;
  }

  return (
    <>
      <Text>{loggedUser?.username}</Text>
      <Avatar src={loggedUser?.pfp} />
      <Text>client id {import.meta.env.VITE_GOOGLE_CLIENT_ID}</Text>
      <Text>api url {import.meta.env.VITE_API_URI}</Text>
    </>
  );
}
