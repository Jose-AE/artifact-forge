"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const generateArtifact_1 = __importDefault(require("../utils/generateArtifact"));
const levelUpArtifact_1 = require("../utils/levelUpArtifact");
const artifactModel_1 = __importDefault(require("../models/artifactModel"));
const router = express_1.default.Router();
function checkArtifactOwnership(artifactId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const artifact = yield artifactModel_1.default.findById(artifactId);
        return artifact.owner === userId;
    });
}
router.post("/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domain } = req.body;
    if (typeof domain == "number") {
        try {
            const userArtifacts = yield artifactModel_1.default.find({ owner: req.userId });
            if (userArtifacts.length < 500) {
                const createdArtifact = yield artifactModel_1.default.create({
                    owner: req.userId,
                    locked: false,
                    artifactData: (0, generateArtifact_1.default)(domain),
                    showcase: false,
                    voters: [],
                    votes: 0,
                });
                res.status(201).send(createdArtifact);
            }
            else {
                res.status(409).send("Inventory full");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Server Error");
        }
    }
    else {
        res.status(500).send("Invalid request body");
    }
}));
router.post("/level-up", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artifactId, levels } = req.body;
    if (artifactId && typeof levels == "number") {
        try {
            if (yield checkArtifactOwnership(artifactId, req.userId)) {
                const artifact = yield artifactModel_1.default.findById(artifactId);
                const leveledUpArtifact = yield artifactModel_1.default.findByIdAndUpdate(artifactId, { artifactData: (0, levelUpArtifact_1.levelUpArtifact)(levels, artifact.artifactData) }, { new: true });
                res.send(leveledUpArtifact);
            }
            else {
                res.status(403).send("User does not own artifact");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Invalid artifact id");
        }
    }
    else {
        res.status(500).send("Invalid request body ");
    }
}));
router.post("/switch-lock", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artifactId } = req.body;
    if (typeof artifactId === "string") {
        try {
            if (yield checkArtifactOwnership(artifactId, req.userId)) {
                const artifact = yield artifactModel_1.default.findById(artifactId);
                const updatedArtifact = yield artifactModel_1.default.findByIdAndUpdate(artifactId, {
                    locked: !artifact.locked,
                }, { new: true });
                res.status(202).send(updatedArtifact);
            }
            else {
                res.status(403).send("User does not own artifact");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Invalid artifact id");
        }
    }
    else {
        res.status(500).send("Invalid request body ");
    }
}));
router.post("/switch-showcase", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artifactId } = req.body;
    if (typeof artifactId == "string") {
        try {
            if (yield checkArtifactOwnership(artifactId, req.userId)) {
                const artifact = yield artifactModel_1.default.findById(artifactId);
                if (artifact.artifactData.level === 20) {
                    const updatedArtifact = yield artifactModel_1.default.findByIdAndUpdate(artifactId, {
                        showcase: !artifact.showcase,
                    }, { new: true });
                    res.status(202).send(updatedArtifact);
                }
                else {
                    res.status(500).send("Artifact is not level 20");
                }
            }
            else {
                res.status(403).send("User does not own artifact");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Invalid artifact id");
        }
    }
    else {
        res.status(500).send("Invalid request body ");
    }
}));
router.post("/vote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vote, artifactId } = req.body;
    if (typeof vote == "string" && typeof artifactId == "string") {
        try {
            const artifact = yield artifactModel_1.default.findById(artifactId);
            if (artifact.voters.includes(req.userId)) {
                // User has already voted
                res.status(400).send("User has already voted for this artifact");
            }
            else {
                //user has not voted
                yield artifactModel_1.default.updateOne({ _id: artifactId }, {
                    $inc: { votes: vote === "up" ? 1 : -1 },
                    $push: { voters: req.userId },
                });
                res.status(202).send("Vote successful");
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send("Invalid artifact id");
        }
    }
    else {
        res.status(500).send("Invalid request body ");
    }
}));
router.post("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { artifactId } = req.body;
    if (typeof artifactId == "string") {
        try {
            if (yield checkArtifactOwnership(artifactId, req.userId)) {
                yield artifactModel_1.default.deleteOne({
                    _id: artifactId,
                });
                res.status(202).send("Artifact deleted");
            }
            else {
                res.status(403).send("User does not own artifact");
            }
        }
        catch (error) {
            res.status(500).send("Invalid artifact id");
        }
    }
    else {
        res.status(500).send("Invalid request body ");
    }
}));
exports.default = router;
//# sourceMappingURL=artifactRoutes.js.map