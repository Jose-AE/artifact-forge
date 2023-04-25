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
} from "@chakra-ui/react";

import { BiRadioCircleMarked } from "react-icons/bi";
import { ArtifactType } from "../types/artifactType";
import {
  ARTIFACT_SET_NAME_ALIASES,
  ARTIFACT_STAT_NAME_ALIASES,
} from "../data/nameAliasesData";

interface NewArtifactInfoProps {
  isOpen: boolean;
  onClose(): void;
  onOpen(): void;
  generatedArtifact: ArtifactType | null;
}

export default function NewArtifactInfo({
  isOpen,
  onClose,
  onOpen,
  generatedArtifact,
}: NewArtifactInfoProps) {
  const arifactType = generatedArtifact?.artifactData.type;
  const arifactSet = generatedArtifact?.artifactData.set;

  const arifactMainstat = generatedArtifact
    ? Object.entries(generatedArtifact?.artifactData.mainStat)[0]
    : null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="325px">
          <Flex p={6} direction="column" alignItems="center">
            <Image
              h="100px"
              w="100px"
              src="https://paimon.moe/images/artifacts/flower_of_paradise_lost_flower.png"
            />
            <Stack spacing={2} align={"center"} mb={3}>
              <Heading
                fontSize={"2xl"}
                fontWeight={500}
                fontFamily={"body"}
                textAlign="center"
              >
                {arifactType}
              </Heading>
              <Text color={"gray.500"}>
                {arifactSet ? ARTIFACT_SET_NAME_ALIASES[arifactSet] : "NA"}
              </Text>
              <Box
                p="7px"
                borderWidth="2px"
                borderColor="gray.500"
                borderRadius="5px"
              >
                {`${
                  arifactMainstat
                    ? ARTIFACT_STAT_NAME_ALIASES[arifactMainstat[0]]
                    : null
                }+${arifactMainstat ? arifactMainstat[1] : null}`}
              </Box>
            </Stack>

            <List spacing={3}>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                CRIT DMG+15.5%
              </ListItem>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                DEF+67
              </ListItem>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                DEF+13.1%
              </ListItem>
              <ListItem>
                <ListIcon as={BiRadioCircleMarked} color="green.500" />
                HP+269
              </ListItem>
            </List>

            <Flex mt="20px">
              <Button onClick={onClose} mr="10px" w="140px">
                Close
              </Button>
              <Button w="140px">Generate another</Button>
            </Flex>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}
