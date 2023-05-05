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
const userModel_1 = __importDefault(require("../models/userModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
function checkArtifactOwnership(artifactId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const artifact = yield artifactModel_1.default.findById(artifactId);
        return artifact.owner._id.toString() === userId;
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
    const { artifactId, vote } = req.body;
    if (typeof artifactId == "string" && (vote === "up" || vote === "down")) {
        try {
            if (!(yield checkArtifactOwnership(artifactId, req.userId))) {
                const test = yield artifactModel_1.default.findOneAndUpdate({ _id: artifactId, voters: { $ne: req.userId } }, // find the artifact by its ID and make sure the user is not already in the voters array
                {
                    $push: { voters: req.userId },
                    $inc: { votes: vote === "up" ? 1 : -1 },
                }, { new: true });
                console.log(yield artifactModel_1.default.findById(artifactId));
                console.log(test);
                res.status(202).send("voted for Artifact");
            }
            else {
                res.status(403).send("Cant vote for your own artifact");
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
//get showcase artifacts
router.get("/showcase-artifacts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artifacts = yield artifactModel_1.default.find({ showcase: true })
            .sort({ votes: -1 }) // sort in descending order based on "votes"
            .limit(49)
            .populate("owner");
        res.status(200).send(artifacts);
    }
    catch (error) {
        res.status(500).send("Error getting artifacts");
    }
}));
router.get("/for-vote", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let randomArtifacts = yield artifactModel_1.default.aggregate([
            {
                $match: {
                    showcase: true,
                    owner: { $ne: new mongoose_1.default.Types.ObjectId(req.userId) },
                    voters: { $ne: req.userId },
                },
            },
            {
                $sample: { size: req.query.num ? Math.abs(Number(req.query.num)) : 1 },
            },
        ]);
        randomArtifacts = randomArtifacts.filter((obj, index) => randomArtifacts.findIndex((item) => item._id === obj._id) === index);
        yield userModel_1.default.populate(randomArtifacts, { path: "owner" });
        res.status(200).send(randomArtifacts);
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Error getting artifacts");
    }
}));
exports.default = router;
//# sourceMappingURL=artifactRoutes.js.map