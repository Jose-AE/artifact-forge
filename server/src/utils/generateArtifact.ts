import {
  ARTIFACT_TYPES,
  ARTIFACT_MAIN_STATS_WEIGHTS,
  ARTIFACT_MAIN_STATS_UPGRADE_VALUES,
  ARTIFACT_MAIN_STATS_VALUES,
} from "../data/artifactStatDistribution";

import { ArtifactI } from "./artifactType";
import { DOMAIN_ARTIFACTS } from "../data/domainArtifacts";
import { weightedChoice } from "./weightedChoice";
import generateSubStat from "./generateSubStat";

export default function generateArtifact(domain: number): ArtifactI {
  domain = domain >= 0 && domain <= DOMAIN_ARTIFACTS.length ? domain : 0; //make sure domain is valid, else default to 0

  const level = 0;
  const set = DOMAIN_ARTIFACTS[domain][Math.floor(Math.random() * 2)];
  const type = ARTIFACT_TYPES[Math.floor(Math.random() * 5)];

  const randomMainStat = weightedChoice(ARTIFACT_MAIN_STATS_WEIGHTS[type]);

  const mainStat = {
    [randomMainStat]: ARTIFACT_MAIN_STATS_VALUES[randomMainStat],
  };

  const numberOfSubStats = Math.random() <= 0.2 ? 4 : 3;

  let subStats = {};
  for (let i = 0; i < numberOfSubStats; i++) {
    subStats = generateSubStat(randomMainStat, subStats);
  }

  return {
    level,
    set,
    type,
    mainStat,
    subStats,
  };
}
