import {
  Box,
  Button,
  HStack,
  Image,
  useColorModeValue,
  Heading,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";

interface DomainProps {
  name: string;
  domainId: number;
  artifacts: Array<string>;
}

export default function Domain({ name, artifacts, domainId }: DomainProps) {
  return (
    <>
      <Box
        role={"group"}
        p={6}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <HStack justifyContent="center">
          <Image
            //bg="red.100"
            height={100}
            width={100}
            objectFit={"cover"}
            src={
              new URL(
                `../assets/artifacts/${artifacts[0]}_flower.png`,
                import.meta.url
              ).href
            }
          />
          <Image
            //bg="red.100"
            height={100}
            width={100}
            objectFit={"cover"}
            src={
              new URL(
                `../assets/artifacts/${artifacts[1]}_flower.png`,
                import.meta.url
              ).href
            }
          />
        </HStack>

        <Stack pt={5}>
          <Heading
            h="75px"
            textAlign="center"
            fontSize={"2xl"}
            fontFamily={"body"}
            fontWeight={500}
          >
            {name}
          </Heading>
          <Button
            onClick={() => {
              axios
                .post(
                  import.meta.env.VITE_API_URI + "/artifact/generate",
                  {
                    domain: domainId,
                  },
                  { withCredentials: true }
                )
                .then((res) => {
                  console.log(res.data.owner);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
          >
            Generate
          </Button>
        </Stack>
      </Box>
    </>
  );
}
