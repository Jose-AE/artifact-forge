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
import { useEffect, useState } from "react";
import { ArtifactType } from "../types/artifactType";
import { BiRadioCircleMarked } from "react-icons/bi";
import { FiArrowUp } from "react-icons/fi";
import { FaArrowUp } from "react-icons/fa";
import { IoPodiumOutline } from "react-icons/io5";

interface ArtifactInfoWindowProps {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  selectedArtifact: ArtifactType | null;
}

export default function ArtifactInfoWindow({
  isOpen,
  onClose,
  onOpen,
  selectedArtifact,
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

  useEffect(() => {
    if (selectedArtifact) {
      setFormattedArtifactData(artifactFormatter(selectedArtifact) as any);
      setLocked(selectedArtifact.locked);
    }
  }, [selectedArtifact]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="500px">
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

            <Flex mt="20px">
              <Button
                isDisabled={selectedArtifact?.artifactData.level === 20}
                leftIcon={<FiArrowUp />}
                onClick={() => {}}
                mr="10px"
              >
                +4
              </Button>
              <Button
                isDisabled={selectedArtifact?.artifactData.level === 20}
                leftIcon={<FiArrowUp />}
                onClick={() => {}}
                mr="10px"
              >
                +20
              </Button>
              <IconButton
                onClick={() => {
                  setLocked(!locked);
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
              />
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
