import { Avatar, Button, Center, Text } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";

import {
  Stack,
  Container,
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Image,
} from "@chakra-ui/react";

export default function AboutPage() {
  //check if user lis logged in
  if (localStorage.getItem("userIsLoggedIn") == "false") {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Container maxW={"7xl"} zIndex={10} position={"relative"}>
        <Stack direction={{ base: "column", lg: "row" }}>
          <Stack>
            <Box mb={{ base: 8, md: 20 }}>
              <Heading
                color={"white"}
                mb={5}
                fontSize={{ base: "3xl", md: "5xl" }}
              >
                About Artifact Forge
              </Heading>
              <Text fontSize={"xl"} color={"gray.400"}>
                Artifact Forge is a personal project of mine, born out of a deep
                passion for both Genshin Impact and programming. This simulator
                offers an immersive and authentic artifact rolling experience,
                without the constraints of resin refreshes. Using the same drop
                rates and roll rates as the original game, the simulator
                provides a realistic depiction of the artifact rolling process.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
              <Box>
                <Text
                  fontFamily={"heading"}
                  fontSize={"3xl"}
                  color={"white"}
                  mb={3}
                >
                  Donate
                </Text>
                <Text fontSize={"xl"} color={"gray.400"}>
                  If you wish to donate, your contribution will go towards the
                  maintenance and improvement of the simulator, which incurs
                  costs for both the database used for storing the artifacts and
                  the domain. Your generosity is deeply appreciated and will
                  make a significant difference in helping me continue to
                  develop and maintain this project. Thank you for your support
                  and good luck with your artifact rolls!
                </Text>
                <Center>
                  <a
                    href="https://ko-fi.com/jose_ae"
                    target="external"
                    rel="noopener noreferrer"
                  >
                    <Image
                      borderRadius="5px"
                      _hover={{ cursor: "pointer" }}
                      mt="20px"
                      w="auto"
                      h="50px"
                      src="https://uploads-ssl.webflow.com/5c14e387dab576fe667689cf/61e11ddcc39341db4958c5cc_Supportbutton.png"
                    />
                  </a>
                </Center>
              </Box>

              <Box>
                <Text
                  fontFamily={"heading"}
                  fontSize={"3xl"}
                  color={"white"}
                  mb={3}
                >
                  Bug Reporting and Feedback
                </Text>

                <Text fontSize={"xl"} color={"gray.400"}>
                  If you happen to find any bugs, incorrect data, or have any
                  other feedback about Artifact Forge, please let me know on my
                  <a
                    href="https://github.com/Jose-AE/artifact-forge"
                    target="external"
                    rel="noopener noreferrer"
                  >
                    {" "}
                    Github Issues
                  </a>{" "}
                  page.
                  <br />
                  <br />
                  <br />
                  Every image related to "Genshin Impact" is intellectual
                  property of miHoYo Co Ltd. This website does not own any of
                  them. All data and images were taken from{" "}
                  <a
                    href="https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki"
                    target="external"
                    rel="noopener noreferrer"
                  >
                    Genshin Impact Wiki
                  </a>
                </Text>
              </Box>
            </SimpleGrid>
          </Stack>
          <Flex flex={1} />
        </Stack>
      </Container>
    </>
  );
}
