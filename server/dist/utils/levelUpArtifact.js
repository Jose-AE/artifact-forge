"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.levelUpArtifact = void 0;
const artifactStatDistribution_1 = require("../data/artifactStatDistribution");
const generateSubStat_1 = __importDefault(require("./generateSubStat"));
function levelUpArtifact(levels, artifact) {
    levels = Math.abs(levels); // make sure levels are possitive
    const mainStat = Object.keys(artifact.mainStat)[0];
    const origLevel = artifact.level;
    artifact.level = Math.min(artifact.level + levels, 20);
    //upgrade levels
    const levelsToUpgrade = artifact.level - origLevel;
    for (let i = 0; i < levelsToUpgrade; i++) {
        artifact.mainStat[mainStat] += artifactStatDistribution_1.ARTIFACT_MAIN_STATS_UPGRADE_VALUES[mainStat];
    }
    //upgrade substats
    const subStatsUpgrades = Math.floor(artifact.level / 4) - Math.floor(origLevel / 4);
    for (let i = 0; i < subStatsUpgrades; i++) {
        if (Object.keys(artifact.subStats).length === 3) {
            artifact.subStats = (0, generateSubStat_1.default)(Object.keys(artifact.mainStat)[0], artifact.subStats);
        }
        else {
            const subStatToUpgrade = Object.keys(artifact.subStats)[Math.floor(Math.random() * 4)];
            artifact.subStats[subStatToUpgrade] +=
                artifactStatDistribution_1.ARTIFACT_SUB_STATS_ROLL_RANGE[subStatToUpgrade][Math.floor(Math.random() * 4)];
        }
    }
    return artifact;
}
exports.levelUpArtifact = levelUpArtifact;
//# sourceMappingURL=levelUpArtifact.js.map