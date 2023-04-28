import {
  Modal,
  ModalOverlay,
  ModalContent,
  Button,
  List,
  ListItem,
  ListIcon,
  Heading,
  Box,
  Image,
  Flex,
  Text,
  Stack,
  Checkbox,
  ModalCloseButton,
  IconButton,
  Tooltip,
  Switch,
} from "@chakra-ui/react";
import { BiLockAlt, BiLockOpenAlt, BiTrash } from "react-icons/bi";

import artifactFormatter from "../utils/arifactFormatter";
import axios from "axios";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { ArtifactType } from "../types/artifactType";
import { BiRadioCircleMarked } from "react-icons/bi";
import { FiArrowUp } from "react-icons/fi";
import { FaArrowUp } from "react-icons/fa";
import { IoPodiumOutline } from "react-icons/io5";

interface ArtifactInfoWindowProps {
  isOpen: boolean;
  onClose(): void;
  userArtifacts: Array<ArtifactType>;
  selectedArtifact: ArtifactType | null;
  setUserArtifacts: Dispatch<SetStateAction<ArtifactType[]>>;
  setSelectedArtifact: Dispatch<SetStateAction<ArtifactType | null>>;
}

export default function ArtifactInfoWindow({
  isOpen,
  onClose,
  userArtifacts,
  selectedArtifact,
  setUserArtifacts,
  setSelectedArtifact,
}: ArtifactInfoWindowProps) {
  const [formattedArtifactData, setFormattedArtifactData] = useState<{
    image: string;
    mainstat: string;
    type: string;
    set: string;
    substats: string;
    level: string;
  } | null>(null);

  const [locked, setLocked] = useState<boolean>(false);

  //find out why selected artifact is not getting updated
  useEffect(() => {
    console.log(selectedArtifact);
    if (selectedArtifact) {
      setFormattedArtifactData(artifactFormatter(selectedArtifact) as any);
      setLocked(selectedArtifact.locked);
    }
  }, [selectedArtifact]);

  function updateArtifact(newArtifact: ArtifactType | null) {
    if (newArtifact) {
      setUserArtifacts([
        ...userArtifacts.filter(
          (artifact) => artifact._id !== newArtifact?._id
        ),
        newArtifact,
      ]);
    } else {
      //if no artifact remove it
      setUserArtifacts(
        userArtifacts.filter(
          (artifact) => artifact._id !== selectedArtifact?._id
        )
      );
    }
    setSelectedArtifact(newArtifact);
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="280px">
          <ModalCloseButton />
          <Flex p={6} direction="column" alignItems="center">
            <Image h="100px" w="100px" src={formattedArtifactData?.image} />
            <Stack spacing={2} align={"center"} mb={3}>
              <Heading
                fontSize={"2xl"}
                fontWeight={500}
                fontFamily={"body"}
                textAlign="center"
              >
                {formattedArtifactData?.type}
              </Heading>
              <Text color={"gray.500"}>{formattedArtifactData?.set}</Text>
              <Box
                p="7px"
                borderWidth="2px"
                borderColor="gray.500"
                borderRadius="5px"
              >
                {formattedArtifactData?.mainstat}
              </Box>
            </Stack>

            <List spacing={3}>
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

            <Flex
              w="230px"
              mt="20px"
              align-items="center"
              justifyContent="space-between"
            >
              {/*Level up buttons */}
              <Button
                w="50%"
                isDisabled={selectedArtifact?.artifactData.level === 20}
                leftIcon={<FiArrowUp />}
                onClick={() => {
                  axios
                    .post(
                      import.meta.env.VITE_API_URI + "/artifact/level-up",
                      {
                        artifactId: selectedArtifact?._id,
                        levels: 4,
                      },
                      { withCredentials: true }
                    )
                    .then((res) => {
                      updateArtifact(res.data);
                    });
                }}
                mr="10px"
              >
                +4
              </Button>
              <Button
                w="50%"
                isDisabled={selectedArtifact?.artifactData.level === 20}
                leftIcon={<FiArrowUp />}
                onClick={() => {
                  axios
                    .post(
                      import.meta.env.VITE_API_URI + "/artifact/level-up",
                      {
                        artifactId: selectedArtifact?._id,
                        levels: 20,
                      },
                      { withCredentials: true }
                    )
                    .then((res) => {
                      updateArtifact(res.data);
                    });
                }}
              >
                +20
              </Button>
            </Flex>

            <Flex mt="10px">
              <IconButton
                onClick={() => {
                  axios
                    .post(
                      import.meta.env.VITE_API_URI + "/artifact/set-locked",
                      {
                        artifactId: selectedArtifact?._id,
                        locked: !locked,
                      },
                      { withCredentials: true }
                    )
                    .then((res) => {
                      console.log("locked set to ", !locked);
                      updateArtifact(res.data);
                    });
                }}
                icon={
                  locked ? (
                    <BiLockAlt size="25px" />
                  ) : (
                    <BiLockOpenAlt size="25px" />
                  )
                }
                aria-label="lock"
                mr="10px"
              />
              <Tooltip
                closeOnClick={false}
                hasArrow
                label="Phone number, Phone number,Phone number,Phone number"
                fontSize="md"
              >
                <Flex
                  justifyContent="center"
                  p="7px"
                  alignItems="center"
                  bg="whiteAlpha.200"
                  mr="10px"
                  borderRadius="5px"
                >
                  <Text ml="5px" mr="5px" as="b">
                    Showcase
                  </Text>
                  <Switch
                    pt="2px"
                    id="showcase"
                    isDisabled={!(selectedArtifact?.artifactData.level === 20)}
                  />
                </Flex>
              </Tooltip>

              <IconButton
                isDisabled={locked}
                aria-label="trash"
                icon={<BiTrash size="25px" />}
                onClick={() => {
                  axios
                    .post(
                      import.meta.env.VITE_API_URI + "/artifact/delete",
                      {
                        artifactId: selectedArtifact?._id,
                      },
                      { withCredentials: true }
                    )
                    .then((res) => {
                      onClose();
                      updateArtifact(null);
                    });
                }}
              />
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
