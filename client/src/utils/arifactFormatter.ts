import {
  ARTIFACT_SET_NAME_ALIASES,
  ARTIFACT_STAT_NAME_ALIASES,
  ARTIFACT_TYPE_NAME_ALIASES,
} from "../data/nameAliasesData";
import { ArtifactType } from "../types/artifactType";

interface ArifactFormattedData {
  image: string;
  mainstat: string;
  type: string;
  set: string;
  substats: Array<string>;
  level: string;
}

export default function artifactFormatter(
  artifact: ArtifactType
): ArifactFormattedData {
  const NOT_PERCENT_STATS = ["EM", "HP", "DEF", "ATK"];

  const artifactData = artifact.artifactData;

  const mainstat = `${
    ARTIFACT_STAT_NAME_ALIASES[Object.keys(artifactData.mainStat)[0]]
  } +${Object.values(artifactData.mainStat)[0]}${
    NOT_PERCENT_STATS.includes(Object.keys(artifactData.mainStat)[0]) ? "" : "%"
  }`;

  const type = ARTIFACT_TYPE_NAME_ALIASES[artifactData.type] as string;

  const set = ARTIFACT_SET_NAME_ALIASES[artifactData.set] as string;

  const substats = Object.keys(artifactData.subStats).map(
    (statName) =>
      `${ARTIFACT_STAT_NAME_ALIASES[statName]}+${
        artifactData.subStats[statName]
      }${NOT_PERCENT_STATS.includes(statName) ? "" : "%"}`
  );

  const level = `+${artifactData.level}`;

  const image = new URL(
    `../assets/artifacts/${
      artifactData.set
    }_${artifactData.type.toLowerCase()}.png`,
    import.meta.url
  ).href;

  return {
    image,
    mainstat,
    type,
    set,
    substats,
    level,
  };
}
