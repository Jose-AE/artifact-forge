"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const artifactModel_1 = __importDefault(require("../models/artifactModel"));
const dotenv = __importStar(require("dotenv"));
const verifyToken_1 = __importDefault(require("../middleware/verifyToken"));
const guestAvatars_1 = require("../data/guestAvatars");
dotenv.config();
const router = express_1.default.Router();
///
//Verify jwt
///
router.get("/verify-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.status(200).send("valid");
    }
    catch (err) {
        res.status(200).send("invalid");
    }
}));
////
//Get logged user artifacts
////
router.get("/artifacts", verifyToken_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const artifacts = yield artifactModel_1.default.find({ owner: req.userId });
        res.status(200).send(artifacts);
    }
    catch (err) {
        res.status(401).send("Error getting artifacts");
    }
}));
////
//Logout user route
////
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guestId } = req.body;
    if (guestId) {
        try {
            const guestUser = yield userModel_1.default.findOne({ googleId: guestId });
            const token = jsonwebtoken_1.default.sign({
                userId: guestUser._id,
                username: guestUser.username,
                pfp: guestUser.pfp,
            }, process.env.JWT_SECRET);
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 10,
                domain: process.env.COOKIE_DOMAIN,
                sameSite: "lax",
            });
            res.status(200).send("User logged out");
        }
        catch (err) {
            console.log(err);
            res.status(500).send("Error logging out");
        }
    }
    else {
        res.clearCookie("token");
        res.status(200).send("User logged out");
    }
}));
////
//Get logged user route
////
router.get("/get", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(200).send(null);
    }
    else {
        try {
            const { pfp, username } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            res.status(200).send({ pfp, username });
        }
        catch (err) {
            res.status(401).send("Invalid jwt");
        }
    }
});
////
//Login user route
////
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { googleAccessToken } = req.body;
    axios_1.default
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${googleAccessToken}`,
        },
    })
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        const username = response.data.given_name;
        const googleId = response.data.sub;
        const pfp = response.data.picture;
        const existingUser = yield userModel_1.default.findOne({ googleId });
        if (!existingUser) {
            //upgrade guest account
            const { userId } = jsonwebtoken_1.default.verify(req.cookies.token, process.env.JWT_SECRET);
            try {
                const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, {
                    googleId,
                    username,
                    pfp,
                });
                const token = jsonwebtoken_1.default.sign({
                    userId: updatedUser._id,
                    username,
                    pfp,
                }, process.env.JWT_SECRET);
                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    domain: process.env.COOKIE_DOMAIN,
                    sameSite: "lax",
                });
                res.status(201).send("created");
            }
            catch (error) {
                console.log(error);
                res.status(500).send("Server error creating user");
            }
        }
        else {
            //sign in user
            try {
                const token = jsonwebtoken_1.default.sign({
                    userId: existingUser._id,
                    username,
                    pfp,
                }, process.env.JWT_SECRET);
                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    domain: process.env.COOKIE_DOMAIN,
                    sameSite: "lax",
                });
                res.status(202).send("Account logged in");
            }
            catch (error) {
                res.status(500).send("Server error validating user token");
            }
        }
    }))
        .catch((err) => {
        console.log(err);
        res.status(400).send("Invalid google access token!");
    });
}));
router.post("/create-guest", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { guestId } = req.body;
    try {
        //random pfp
        const pfp = guestAvatars_1.GUEST_AVATARS[Math.floor(Math.random() * guestAvatars_1.GUEST_AVATARS.length)];
        // username
        const username = "Guest";
        const createdUser = yield userModel_1.default.create({
            googleId: guestId,
            username,
            pfp,
        });
        const token = jsonwebtoken_1.default.sign({
            userId: createdUser._id,
            username,
            pfp,
        }, process.env.JWT_SECRET);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 30 * 12 * 10,
            domain: process.env.COOKIE_DOMAIN,
            sameSite: "lax",
        });
        res.status(201).send("Guest account created");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server error creating guest user");
    }
}));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map