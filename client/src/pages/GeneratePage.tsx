import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";

import Domain from "../components/Domain";
import { DOMAINS } from "../data/domainsData";

export default function GeneratePage() {
  return (
    <>
      <SimpleGrid columns={4} gap={6} minChildWidth="250px">
        {DOMAINS.map((domain, i) => {
          return (
            <Domain
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
