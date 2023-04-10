import {
  ARTIFACT_SUB_STATS_ROLL_RANGE,
  ARTIFACT_SUB_STATS_WEIGHTS,
} from "../data/artifactStatDistribution";
import { weightedChoice } from "./weightedChoice";

interface SubStats {
  [key: string]: number;
}

export default function generateSubStat(
  mainStat: string,
  subStats: SubStats
): SubStats {
  while (true) {
    const randomStat = weightedChoice(ARTIFACT_SUB_STATS_WEIGHTS[mainStat]);
    if (randomStat in subStats) {
      continue;
    } else {
      subStats[randomStat] =
        ARTIFACT_SUB_STATS_ROLL_RANGE[randomStat][
          Math.floor(Math.random() * 4)
        ];
      break;
    }
  }

  return subStats;
}
