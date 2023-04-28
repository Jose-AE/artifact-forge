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
} from "@chakra-ui/react";

import { BiLockAlt, BiLockOpenAlt, BiTrash } from "react-icons/bi";

import { BiRadioCircleMarked } from "react-icons/bi";
import { ArtifactType } from "../types/artifactType";

import artifactFormatter from "../utils/arifactFormatter";
import axios from "axios";
import { useEffect, useState } from "react";

interface NewArtifactInfoProps {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  generatedArtifact: ArtifactType | null;
  generateArtifact(artifactId: number | null): void;
}

export default function NewArtifactInfo({
  isOpen,
  onClose,
  onOpen,
  generatedArtifact,
  generateArtifact,
}: NewArtifactInfoProps) {
  const artifactData = generatedArtifact
    ? artifactFormatter(generatedArtifact)
    : null;

  const [locked, setLocked] = useState<boolean>(false);

  useEffect(() => {
    setLocked(false);
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="325px">
          <ModalCloseButton />
          <Flex p={6} direction="column" alignItems="center">
            <Image h="100px" w="100px" src={artifactData?.image} />
            <Stack spacing={2} align={"center"} mb={3}>
              <Heading
                fontSize={"2xl"}
                fontWeight={500}
                fontFamily={"body"}
                textAlign="center"
              >
                {artifactData?.type}
              </Heading>
              <Text color={"gray.500"}>{artifactData?.set}</Text>
              <Box
                p="7px"
                borderWidth="2px"
                borderColor="gray.500"
                borderRadius="5px"
              >
                {artifactData?.mainstat}
              </Box>
            </Stack>

            <List spacing={3}>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {artifactData?.substats[0]}
              </ListItem>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {artifactData?.substats[1]}
              </ListItem>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                {artifactData?.substats[2]}
              </ListItem>

              {artifactData?.substats.length === 4 ? (
                <ListItem>
                  <ListIcon as={BiRadioCircleMarked} color="green.500" />
                  {artifactData?.substats[3]}
                </ListItem>
              ) : null}
            </List>

            <Flex mt="20px">
              <Button
                onClick={() => {
                  setLocked(false);
                  generateArtifact(null);
                }}
                mr="10px"
              >
                Generate another
              </Button>
              <IconButton
                onClick={() => {
                  axios
                    .post(
                      import.meta.env.VITE_API_URI + "/artifact/set-locked",
                      {
                        artifactId: generatedArtifact?._id,
                      },
                      { withCredentials: true }
                    )
                    .then((res) => {
                      setLocked(!locked);
                    });
                }}
                aria-label="lock"
                mr="10px"
                icon={
                  locked ? (
                    <BiLockAlt size="25px" />
                  ) : (
                    <BiLockOpenAlt size="25px" />
                  )
                }
              />
              <IconButton
                onClick={() => {
                  onClose();
                  axios.post(
                    import.meta.env.VITE_API_URI + "/artifact/delete",
                    {
                      artifactId: generatedArtifact?._id,
                    },
                    { withCredentials: true }
                  );
                }}
                aria-label="trash"
                isDisabled={locked}
                icon={<BiTrash size="25px" />}
              />
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
