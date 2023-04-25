import { Button, SimpleGrid, useDisclosure } from "@chakra-ui/react";

import Domain from "../components/Domain";
import NewArtifactInfo from "../components/NewArtifactInfo";
import { DOMAINS } from "../data/domainsData";
import { useState, useRef } from "react";
import { ArtifactType } from "../types/artifactType";
import axios from "axios";

export default function GeneratePage() {
  const {
    isOpen: isOpenNewArifactModal,
    onOpen: onOpenNewArifactModal,
    onClose: onCloseNewArifactModal,
  } = useDisclosure();

  const [generatedArtifact, setGeneratedArtifact] =
    useState<ArtifactType | null>(null);

  const lastDomainId = useRef<number | null>(null);
  async function generateArtifact(id: number | null) {
    if (id === null) {
      id = lastDomainId.current;
    } else lastDomainId.current = id;

    axios
      .post(
        import.meta.env.VITE_API_URI + "/artifact/generate",
        {
          domain: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setGeneratedArtifact(res.data);
        onOpenNewArifactModal();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <NewArtifactInfo
        generateArtifact={generateArtifact}
        generatedArtifact={generatedArtifact}
        isOpen={isOpenNewArifactModal}
        onClose={onCloseNewArifactModal}
        onOpen={onOpenNewArifactModal}
      />

      <SimpleGrid columns={4} gap={6} minChildWidth="250px">
        {DOMAINS.map((domain, i) => {
          return (
            <Domain
              generateArtifact={generateArtifact}
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