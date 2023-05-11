import {
  Box,
  Select,
  Button,
  SimpleGrid,
  Text,
  useDisclosure,
  Image,
  Flex,
  Grid,
  CloseButton,
  Spinner,
  Center,
  Stack,
  Heading,
  List,
  ListItem,
  ListIcon,
  Avatar,
  IconButton,
} from "@chakra-ui/react";

import { Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ArtifactType } from "../types/artifactType";
import axios from "axios";
import artifactFormatter from "../utils/arifactFormatter";
import { BiDislike, BiLike, BiRadioCircleMarked } from "react-icons/bi";
import { FiArrowUp } from "react-icons/fi";

const testArtifact: ArtifactType = {
  _id: "644da0d5a21f019a1a111744",
  owner: { username: "D", pfp: "d" },
  locked: false,
  showcase: false,
  artifactData: {
    level: 20,
    set: "pale_flame",
    type: "GOBLET",
    mainStat: {
      ATK: 4560,
    },
    subStats: {
      ATK: 15.56,
      CR: 11.280000000000001,
      HP_P: 15.15,
      DEF: 18.52,
    },
  },
  voters: ["s"],
  votes: 0,
};

function VoteArtifact({
  thisArtifact,
  setForVoteArtifacts,
  forVoteArtifacts,
}: {
  thisArtifact: ArtifactType;
  setForVoteArtifacts: Dispatch<SetStateAction<ArtifactType[]>>;
  forVoteArtifacts: Array<ArtifactType>;
}) {
  const navigate = useNavigate();

  function Vote(typeOfVote: string) {
    axios
      .post(
        import.meta.env.VITE_API_URI + "/artifact/vote",
        { artifactId: thisArtifact._id, vote: typeOfVote },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        axios
          .get(import.meta.env.VITE_API_URI + `/artifact/for-vote?num=3`, {
            withCredentials: true,
          })
          .then((res) => {
            setForVoteArtifacts(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        if (err.request.status === 401) {
          navigate("/login");
        } else {
          console.log(err);
        }
      });
  }

  const formattedArtifactData = artifactFormatter(thisArtifact);

  return (
    <Flex direction="column">
      <Flex mt="0px" justifyContent="center" gap={1} p="10px">
        <Avatar
          size="xs"
          name={thisArtifact.owner?.username}
          src={thisArtifact.owner?.pfp}
        />
        <Text as="i">{thisArtifact.owner?.username}</Text>
      </Flex>

      <Flex
        alignItems="center"
        direction="column"
        borderWidth="2px"
        borderRadius="5px"
        bg="gray.700"
        p="10px"
      >
        <Flex direction="row" gap={5}>
          <Flex direction="column">
            <Stack spacing={1} align={"center"} mb={2}>
              <Heading
                fontSize={"15px"}
                fontWeight={500}
                fontFamily={"body"}
                textAlign="center"
              >
                {formattedArtifactData?.type}
              </Heading>

              <Text textAlign="center" color={"gray.500"}>
                {formattedArtifactData?.set}
              </Text>
            </Stack>
            <Image h="150px" w="150px" src={formattedArtifactData?.image} />
          </Flex>

          <Flex direction="column">
            <Box
              fontSize={
                formattedArtifactData?.mainstat?.length > 10 ? "12" : "16"
              }
              textAlign="center"
              mb="20px"
              p="7px"
              borderWidth="2px"
              borderColor="gray.500"
              borderRadius="5px"
              justifyContent="center"
            >
              {formattedArtifactData?.mainstat}
            </Box>

            <List fontSize="16px" spacing={3}>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {formattedArtifactData?.substats[0]}
              </ListItem>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {formattedArtifactData?.substats[1]}
              </ListItem>

              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {formattedArtifactData?.substats[2]}
              </ListItem>

              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {formattedArtifactData?.substats[3]}
              </ListItem>
            </List>
          </Flex>
        </Flex>
        <Center p={2} gap={2} w="100%">
          <IconButton
            aria-label="upvote"
            icon={<BiLike />}
            w="50%"
            onClick={() => {
              Vote("up");
            }}
          />

          <IconButton
            aria-label="downvote"
            icon={<BiDislike />}
            w="50%"
            onClick={() => {
              Vote("down");
            }}
          />
        </Center>
      </Flex>
    </Flex>
  );
}

function ShowcaseArtifact({ thisArtifact }: { thisArtifact: ArtifactType }) {
  const formattedArtifactData = artifactFormatter(thisArtifact);

  return (
    <Box borderWidth="2px" borderRadius="5px" bg="gray.700">
      <Flex alignItems="center" pl="10px" pt="10px" alignContent="center">
        <BiLike />
        <Text ml="5px" as="b">
          {thisArtifact.votes}
        </Text>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Image h="75px" w="75px" src={formattedArtifactData?.image} />
        <Stack spacing={1} align={"center"} mb={2}>
          <Heading
            fontSize={"15px"}
            fontWeight={500}
            fontFamily={"body"}
            textAlign="center"
          >
            {formattedArtifactData?.type}
          </Heading>

          <Text textAlign="center" color={"gray.500"}>
            {formattedArtifactData?.set}
          </Text>
        </Stack>

        <Box
          fontSize={formattedArtifactData?.mainstat?.length > 10 ? "12" : "16"}
          textAlign="center"
          mb="10px"
          p="7px"
          borderWidth="2px"
          borderColor="gray.500"
          borderRadius="5px"
          minH="40px"
          justifyContent="center"
        >
          {formattedArtifactData?.mainstat}
        </Box>

        <List fontSize="12px" spacing={3}>
          <ListItem>
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {formattedArtifactData?.substats[0]}
          </ListItem>
          <ListItem>
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {formattedArtifactData?.substats[1]}
          </ListItem>
          <ListItem>
            <ListIcon as={BiRadioCircleMarked} color="green.500" />
            {formattedArtifactData?.substats[2]}
          </ListItem>

          {formattedArtifactData?.substats.length === 4 ? (
            <ListItem>
              <ListIcon as={BiRadioCircleMarked} color="green.500" />
              {formattedArtifactData?.substats[3]}
            </ListItem>
          ) : null}
        </List>
      </Flex>
      <Flex mt="10px" justifyContent="center" gap={1} p="10px">
        <Avatar
          name={thisArtifact.owner.username}
          size="xs"
          src={thisArtifact.owner.pfp}
        />
        <Text as="i"> {thisArtifact.owner.username}</Text>
      </Flex>
    </Box>
  );
}

export default function ExplorePage() {
  const [loadingArtifacts, setLoadingArtifacts] = useState<boolean>(false);
  const [showcaseArtifacts, setShowcaseArtifacts] = useState<
    Array<ArtifactType>
  >([]);
  const [forVoteArtifacts, setForVoteArtifacts] = useState<Array<ArtifactType>>(
    []
  );

  useEffect(() => {
    setLoadingArtifacts(true);
    axios
      .get(import.meta.env.VITE_API_URI + "/artifact/showcase-artifacts", {
        withCredentials: true,
      })
      .then((res) => {
        //set showcase artifact
        setShowcaseArtifacts(res.data);
        setLoadingArtifacts(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  let initialized = false;

  useEffect(() => {
    if (!initialized && forVoteArtifacts.length < 3) {
      initialized = true;
      //load 3 vote artifacts

      axios
        .get(import.meta.env.VITE_API_URI + "/artifact/for-vote?num=3", {
          withCredentials: true,
        })
        .then((res) => {
          setForVoteArtifacts(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <>
      <Flex flexWrap={{ base: "wrap", md: "nowrap" }} gap={5}>
        <Box w="100%" borderRadius="10px">
          <Heading p="10px" mb={5}>
            Vote for Artifacts
          </Heading>
          <SimpleGrid gap={5} columns={1} minChildWidth="350px">
            {forVoteArtifacts.length === 0 ? (
              <Center h="300px" bg="gray.700" borderRadius="5px">
                <Text textAlign="center">
                  There are currently no more artifacts to vote for, come back
                  later!
                </Text>
              </Center>
            ) : (
              forVoteArtifacts.map((artifact, i) => (
                <VoteArtifact
                  forVoteArtifacts={forVoteArtifacts}
                  setForVoteArtifacts={setForVoteArtifacts}
                  key={i}
                  thisArtifact={artifact}
                />
              ))
            )}
          </SimpleGrid>
        </Box>
      </Flex>

      <Heading p="10px">Top Generated Artifacts</Heading>

      {loadingArtifacts ? (
        <Center h={`calc(100vh - ${220}px)`}>
          <Spinner color="whiteAlpha.300" thickness="10px" boxSize={100} />
        </Center>
      ) : (
        <>
          <SimpleGrid
            columns={4}
            gap={4}
            minChildWidth={{
              base: "150px",
              sm: "200px",
              md: "200px",
              lg: "200px",
              "2xl": "200px",
            }}
          >
            {showcaseArtifacts.map((artifact, i) => {
              return <ShowcaseArtifact thisArtifact={artifact} key={i} />;
            })}
          </SimpleGrid>
        </>
      )}
    </>
  );
}
