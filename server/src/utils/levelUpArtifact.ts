import {
  ARTIFACT_MAIN_STATS_UPGRADE_VALUES,
  ARTIFACT_SUB_STATS_ROLL_RANGE,
} from "../data/artifactStatDistribution";
import { Artifact } from "./artifactType";
import generateSubStat from "./generateSubStat";

export function levelUpArtifact(levels: number, artifact: Artifact): Artifact {
  const mainStat = Object.keys(artifact.mainStat)[0];
  const origLevel = artifact.level;
  artifact.level = Math.min(artifact.level + levels, 20);

  //upgrade levels
  const levelsToUpgrade = artifact.level - origLevel;

  for (let i = 0; i < levelsToUpgrade; i++) {
    artifact.mainStat[mainStat] += ARTIFACT_MAIN_STATS_UPGRADE_VALUES[mainStat];
  }

  //upgrade substats
  const subStatsUpgrades =
    Math.floor(artifact.level / 4) - Math.floor(origLevel / 4);

  for (let i = 0; i < subStatsUpgrades; i++) {
    if (Object.keys(artifact.subStats).length === 3) {
      artifact.subStats = generateSubStat(
        Object.keys(artifact.mainStat)[0],
        artifact.subStats
      );
    } else {
      const subStatToUpgrade = Object.keys(artifact.subStats)[
        Math.floor(Math.random() * 4)
      ];
      artifact.subStats[subStatToUpgrade] +=
        ARTIFACT_SUB_STATS_ROLL_RANGE[subStatToUpgrade][
          Math.floor(Math.random() * 4)
        ];
    }
  }

  return artifact;
}
