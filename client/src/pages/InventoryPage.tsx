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
} from "@chakra-ui/react";

import Domain from "../components/Domain";
import NewArtifactInfo from "../components/NewArtifactInfo";
import { useState, useRef, useEffect, SetStateAction, Dispatch } from "react";
import { ArtifactType } from "../types/artifactType";
import axios from "axios";
import artifactFormatter from "../utils/arifactFormatter";
import {
  ARTIFACT_SET_NAME_ALIASES,
  ARTIFACT_STAT_NAME_ALIASES,
} from "../data/nameAliasesData";

import { BiLockAlt, BiLockOpenAlt, BiTrash } from "react-icons/bi";
import { HiLockClosed } from "react-icons/hi";
import ArtifactInfoWindow from "../components/ArtifactInfoWindow";

function Artifact({
  thisArtifact,
  onOpen,
  setSelectedArtifact,
}: {
  thisArtifact: ArtifactType;
  onOpen(): void;
  setSelectedArtifact: Dispatch<SetStateAction<ArtifactType | null>>;
}) {
  const formatedArtifactData = artifactFormatter(thisArtifact);

  return (
    <Box
      onClick={() => {
        setSelectedArtifact(thisArtifact);
        onOpen();
      }}
      maxW="80px"
      borderRadius="5px"
      bg="gray.700"
      _hover={{ bg: "gray.600", cursor: "pointer" }}
    >
      <Image src={formatedArtifactData.image} />

      <Flex
        visibility={thisArtifact.locked ? "visible" : "hidden"}
        paddingRight="3px"
        paddingTop="3px"
        justifyContent="right"
      ></Flex>

      <Flex
        borderBottomRadius="5px"
        bg="whiteAlpha.200"
        justifyContent="center"
        alignItems="center"
      >
        <Text as="b" textAlign="center" mr="3px">
          {formatedArtifactData.level}
        </Text>
        {thisArtifact.locked ? <HiLockClosed color="#F56565" /> : null}
      </Flex>
    </Box>
  );
}

function Searchbar({
  setSetFilter,
  setStatFilter,
}: {
  setSetFilter: Dispatch<SetStateAction<string | null>>;
  setStatFilter: Dispatch<SetStateAction<string | null>>;
}) {
  return (
    <Box>
      <Text p="5px">Filter by set</Text>
      <Select
        placeholder="None"
        onChange={(e) => {
          setSetFilter(e.target.value);
        }}
      >
        {Object.entries(ARTIFACT_SET_NAME_ALIASES).map((name, i) => (
          <option key={i} value={name[0]}>
            {name[1]}
          </option>
        ))}
      </Select>
      <Text p="5px">Filter by stat</Text>
      <Select
        placeholder="None"
        onChange={(e) => {
          setStatFilter(e.target.value);
        }}
      >
        {Object.entries(ARTIFACT_STAT_NAME_ALIASES).map((name, i) => (
          <option key={i} value={name[0]}>
            {name[0].slice(-2) === "_P" ? `${name[1]}%` : name[1]}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export default function InventoryPage() {
  const [selectedArtifact, setSelectedArtifact] = useState<ArtifactType | null>(
    null
  );
  const [userArtifacts, setUserArtifacts] = useState<Array<ArtifactType>>([]);
  const [setFilter, setSetFilter] = useState<string | null>(null);
  const [statFilter, setStatFilter] = useState<string | null>(null);

  const {
    isOpen: isOpenArifactInfoModal,
    onOpen: onOpenArifactInfoModal,
    onClose: onCloseArifactInfoModal,
  } = useDisclosure();

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URI + "/user/artifacts", {
        withCredentials: true,
      })
      .then((res) => {
        setUserArtifacts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function filterAndSortArtifacts(): Array<ArtifactType> {
    let filteredArtifacts = userArtifacts;
    //filter stat
    filteredArtifacts = statFilter
      ? userArtifacts.filter(
          (artifact) => artifact.artifactData.mainStat[statFilter] !== undefined
        )
      : userArtifacts;

    //filter set
    filteredArtifacts = setFilter
      ? filteredArtifacts.filter(
          (artifact) => artifact.artifactData.set === setFilter
        )
      : filteredArtifacts;

    filteredArtifacts.sort((a, b) => {
      // Sort by level (in descending order)
      if (b.artifactData.level !== a.artifactData.level) {
        return b.artifactData.level - a.artifactData.level;
      }

      // Sort by set
      if (a.artifactData.set !== b.artifactData.set) {
        return a.artifactData.set.localeCompare(b.artifactData.set);
      }

      // Sort by type
      if (a.artifactData.type !== b.artifactData.type) {
        return a.artifactData.type.localeCompare(b.artifactData.type);
      }

      return 0;
    });

    return filteredArtifacts;
  }

  return (
    <>
      <ArtifactInfoWindow
        isOpen={isOpenArifactInfoModal}
        onClose={onCloseArifactInfoModal}
        onOpen={onOpenArifactInfoModal}
        selectedArtifact={selectedArtifact}
      />
      <Searchbar setSetFilter={setSetFilter} setStatFilter={setStatFilter} />
      <Box h={`calc(100vh - ${190}px)`} overflowY="auto" mt="10px">
        <Grid
          autoRows="auto"
          templateColumns={{
            base: "repeat(4, minmax(0, 1fr))",
            sm: "repeat(6, minmax(0, 1fr))",
            md: "repeat(8, minmax(0, 1fr))",
            lg: "repeat(12, minmax(0, 1fr))",
            "2xl": "repeat(17, minmax(0, 1fr))",
          }}
          gap={3}
        >
          {filterAndSortArtifacts().map((artifact, i) => {
            return (
              <Artifact
                key={i}
                setSelectedArtifact={setSelectedArtifact}
                thisArtifact={artifact}
                onOpen={onOpenArifactInfoModal}
              />
            );
          })}
        </Grid>
      </Box>
    </>
  );
}
