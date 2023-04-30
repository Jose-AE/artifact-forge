import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Avatar,
  Grid,
  List,
  Image,
  ListItem,
  Center,
  ListIcon,
} from "@chakra-ui/react";
import { BiRadioCircleMarked } from "react-icons/bi";
import { Navigate, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const showcaseArtifacts = [
  {
    img: new URL(
      "../assets/artifacts/blizzard_strayer_goblet.png",
      import.meta.url
    ).href,
    mainStat: "Cryo DMG Bonus+46.6%",
    substats: ["ATK+5.3%", "CRIT Rate+7.4%", "CRIT DMG+27.2%", "HP+209"],
  },
  {
    img: new URL(
      "../assets/artifacts/emblem_of_severed_fate_circlet.png",
      import.meta.url
    ).href,
    mainStat: "CRIT DMG+62.2%",
    substats: [
      "CRIT Rate+17.5%",
      "Energy Recharge+5.8%",
      "ATK+5.8%",
      "Elemental Mastery+16",
    ],
  },
  {
    img: new URL("../assets/artifacts/nymphs_dream_flower.png", import.meta.url)
      .href,
    mainStat: "HP+4780",
    substats: [
      "Energy Recharge+9.7%",
      "CRIT Rate+10.9%",
      "CRIT DMG+14.0%",
      "ATK+5.3%",
    ],
  },
  {
    img: new URL(
      "../assets/artifacts/viridescent_venerer_circlet.png",
      import.meta.url
    ).href,
    mainStat: "Elemental Mastery+187",
    substats: [
      "Energy Recharge+35.0%",
      "CRIT Rate+3.1%",
      "HP+4.1%",
      "ATK+5.8%",
    ],
  },
];

function Artifact({
  img,
  mainStat,
  substats,
}: {
  img: string;
  mainStat: string;
  substats: string[];
}) {
  return (
    <Box
      borderWidth="2px"
      _hover={{
        transform: "scale(1.05)",
        transition: "transform .2s ease-in-out",
      }}
      w="250"
      bg="whiteAlpha.200"
      borderRadius="10px"
    >
      <Flex p={6} direction="column" alignItems="center">
        <Image h="300px" w="300px" src={img} />
        <Stack spacing={3} align={"center"} mb={3}>
          <Box
            p="7px"
            borderWidth="2px"
            borderColor="gray.500"
            borderRadius="5px"
          >
            <Text fontSize="2xl">{mainStat}</Text>
          </Box>
        </Stack>

        <List spacing={3}>
          <ListItem fontSize="20px">
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {substats[0]}
          </ListItem>
          <ListItem fontSize="20px">
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {substats[1]}
          </ListItem>
          <ListItem fontSize="20px">
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {substats[2]}
          </ListItem>
          <ListItem fontSize="20px">
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {substats[3]}
          </ListItem>
        </List>
      </Flex>
    </Box>
  );
}

function LoginButton() {
  const navigate = useNavigate();

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
          localStorage.setItem("userIsLoggedIn", "true");
          navigate("/");
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
      </Center>
    </>
  );
}

export default function LoginPage() {
  //check if user lis logged in
  if (localStorage.getItem("userIsLoggedIn") == "true") {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading textAlign="center" fontSize={"4xl"}>
            Start forging artifacts!
          </Heading>
          <Text fontSize={"20px"} textAlign="center" color={"gray.300"}>
            Sign in to start forging artifacts, save them to your inventory,
            share them with other users and access them from anywhere!
          </Text>
        </Stack>
        <LoginButton />
      </Stack>
      <Flex flexWrap="wrap" gap={10} justifyContent="center">
        {showcaseArtifacts.map((artifact, i) => (
          <Artifact
            key={i}
            mainStat={artifact.mainStat}
            img={artifact.img}
            substats={artifact.substats}
          />
        ))}
      </Flex>
    </>
  );
}
