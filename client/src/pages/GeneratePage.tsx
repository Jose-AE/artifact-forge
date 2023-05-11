import { Button, SimpleGrid, useDisclosure, useToast } from "@chakra-ui/react";

import Domain from "../components/Domain";
import NewArtifactInfo from "../components/NewArtifactInfo";
import { DOMAINS } from "../data/domainsData";
import { useState, useRef } from "react";
import { ArtifactType } from "../types/artifactType";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function GeneratePage() {
  //check if user lis logged in
  /*
  if (localStorage.getItem("userIsLoggedIn") == "false") {
    return <Navigate to="/login" />;
  }
  */

  const toast = useToast();

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
        if (err.response.status === 409) {
          toast.closeAll();
          toast({
            title: "Inventory full",
            description: "Delete some artifacts to generate more",
            status: "error",
            duration: 2000,
            isClosable: false,
          });
        } else {
          toast.closeAll();
          toast({
            title: "An error occured",
            description: "Could not generate artifact",
            status: "error",
            duration: 2000,
            isClosable: false,
          });
        }
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
