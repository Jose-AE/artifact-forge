"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const artifactStatDistribution_1 = require("../data/artifactStatDistribution");
const domainArtifacts_1 = require("../data/domainArtifacts");
const weightedChoice_1 = require("./weightedChoice");
const generateSubStat_1 = __importDefault(require("./generateSubStat"));
function generateArtifact(domain) {
    domain = domain >= 0 && domain <= domainArtifacts_1.DOMAIN_ARTIFACTS.length ? domain : 0; //make sure domain is valid, else default to 0
    const level = 0;
    const set = domainArtifacts_1.DOMAIN_ARTIFACTS[domain][Math.floor(Math.random() * 2)];
    const type = artifactStatDistribution_1.ARTIFACT_TYPES[Math.floor(Math.random() * 5)];
    const randomMainStat = (0, weightedChoice_1.weightedChoice)(artifactStatDistribution_1.ARTIFACT_MAIN_STATS_WEIGHTS[type]);
    const mainStat = {
        [randomMainStat]: artifactStatDistribution_1.ARTIFACT_MAIN_STATS_VALUES[randomMainStat],
    };
    const numberOfSubStats = Math.random() <= 0.2 ? 4 : 3;
    let subStats = {};
    for (let i = 0; i < numberOfSubStats; i++) {
        subStats = (0, generateSubStat_1.default)(randomMainStat, subStats);
    }
    return {
        level,
        set,
        type,
        mainStat,
        subStats,
    };
}
exports.default = generateArtifact;
//# sourceMappingURL=generateArtifact.js.map