import { useContext, useEffect } from "react";
import { LoginContext } from "../App";
import { Avatar, Button, Text } from "@chakra-ui/react";

export default function SettingsPage() {
  const { loggedUser, setLoggedUser } = useContext(LoginContext);

  return (
    <>
      <Text>{loggedUser?.username}</Text>
      <Avatar src={loggedUser?.pfp} />
    </>
  );
}
