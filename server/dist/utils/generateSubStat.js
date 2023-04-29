"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const artifactStatDistribution_1 = require("../data/artifactStatDistribution");
const weightedChoice_1 = require("./weightedChoice");
function generateSubStat(mainStat, subStats) {
    while (true) {
        const randomStat = (0, weightedChoice_1.weightedChoice)(artifactStatDistribution_1.ARTIFACT_SUB_STATS_WEIGHTS[mainStat]);
        if (randomStat in subStats) {
            continue;
        }
        else {
            subStats[randomStat] =
                artifactStatDistribution_1.ARTIFACT_SUB_STATS_ROLL_RANGE[randomStat][Math.floor(Math.random() * 4)];
            break;
        }
    }
    return subStats;
}
exports.default = generateSubStat;
//# sourceMappingURL=generateSubStat.js.map