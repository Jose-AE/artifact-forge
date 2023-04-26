import {
  Box,
  Select,
  Button,
  SimpleGrid,
  Text,
  useDisclosure,
  Image,
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

function Artifact({ thisArtifact }: { thisArtifact: ArtifactType }) {
  const formatedArtifactData = artifactFormatter(thisArtifact);

  return (
    <Box
      borderRadius="5px"
      bg="gray.700"
      _hover={{ bg: "gray.600", cursor: "pointer" }}
    >
      <Image src={formatedArtifactData.image} />
      <Text
        borderBottomRadius="5px"
        bg="gray.500"
        textAlign="center"
        fontWeight="600"
      >
        {formatedArtifactData.level}
      </Text>
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
    <Box borderRadius="5px">
      <Text>Filter by set</Text>
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
      <Text>Filter by stat</Text>
      <Select
        placeholder="None"
        onChange={(e) => {
          setStatFilter(e.target.value);
        }}
      >
        {Object.entries(ARTIFACT_STAT_NAME_ALIASES).map((name, i) => (
          <option key={i} value={name[0]}>
            {name[1]}
          </option>
        ))}
      </Select>
    </Box>
  );
}

export default function InventoryPage() {
  const [userArtifacts, setUserArtifacts] = useState<Array<ArtifactType>>([]);
  const [setFilter, setSetFilter] = useState<string | null>(null);
  const [statFilter, setStatFilter] = useState<string | null>(null);

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

  function sortArtifacts(
    artifact1: ArtifactType,
    artifact2: ArtifactType
  ): number {
    console.log(artifact1, artifact2);
    if (!statFilter && !setFilter) {
      return artifact1.artifactData.set.localeCompare(
        artifact2.artifactData.set
      );
    }

    /*
    If the result is negative a is sorted before b.
    If the result is positive b is sorted before a.
    If the result is 0 no changes are done with the sort order of the two values.
    */
  }

  return (
    <>
      {setFilter}
      {statFilter}
      <Searchbar setSetFilter={setSetFilter} setStatFilter={setStatFilter} />
      <Box h="65vh" overflowY="auto" mt="10px">
        <SimpleGrid columns={8} gap={3} minChildWidth="80px">
          {userArtifacts.sort(sortArtifacts).map((artifact, i) => {
            return <Artifact key={i} thisArtifact={artifact} />;
          })}
        </SimpleGrid>
      </Box>
    </>
  );
}
