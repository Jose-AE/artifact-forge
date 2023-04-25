import { Button, SimpleGrid, useDisclosure } from "@chakra-ui/react";

import Domain from "../components/Domain";
import NewArtifactInfo from "../components/NewArtifactInfo";
import { DOMAINS } from "../data/domainsData";
import { useState } from "react";
import { ArtifactType } from "../types/artifactType";

export default function GeneratePage() {
  const {
    isOpen: isOpenNewArifactModal,
    onOpen: onOpenNewArifactModal,
    onClose: onCloseNewArifactModal,
  } = useDisclosure();

  const [generatedArtifact, setGeneratedArtifact] =
    useState<ArtifactType | null>(null);

  return (
    <>
      <NewArtifactInfo
        generatedArtifact={generatedArtifact}
        isOpen={isOpenNewArifactModal}
        onClose={onCloseNewArifactModal}
        onOpen={onOpenNewArifactModal}
      />

      <SimpleGrid columns={4} gap={6} minChildWidth="250px">
        {DOMAINS.map((domain, i) => {
          return (
            <Domain
              setGeneratedArtifact={setGeneratedArtifact}
              onOpenNewArifactModal={onOpenNewArifactModal}
              key={i}
              domainId={i}
              name={domain.name}
              artifacts={domain.artifacts}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}
