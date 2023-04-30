import { useContext, useEffect, useState } from "react";
import { Avatar, Button, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
export default function AboutPage() {
  //check if user lis logged in
  if (localStorage.getItem("userIsLoggedIn") == "false") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Text>{0}</Text>
      <Avatar src={"d"} />
      <Text>client id {import.meta.env.VITE_GOOGLE_CLIENT_ID}</Text>
      <Text>api url {import.meta.env.VITE_API_URI}</Text>
    </>
  );
}
