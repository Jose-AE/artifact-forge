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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TEST_MODE = true;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const verifyToken_1 = __importDefault(require("./middleware/verifyToken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv = __importStar(require("dotenv"));
const express_rate_limit_1 = require("express-rate-limit");
dotenv.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
//req limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 1000 * 60 * 15,
    max: 10000, //max of 10,000 req every 15 min
});
app.use(limiter);
//routes
const artifactRoutes_1 = __importDefault(require("./routes/artifactRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
app.use("/user", userRoutes_1.default);
app.use("/artifact", verifyToken_1.default, artifactRoutes_1.default);
const PORT = process.env.PORT || 3000;
mongoose_1.default.connect(TEST_MODE
    ? process.env.TEST_DB_URI
    : process.env.DB_URI, {
    dbName: "Main",
});
app.get("/", (req, res) => {
    res.send("Artifact Forge API 1.0");
});
app.listen(PORT, () => {
    console.log("server running in port: " + PORT);
});
//# sourceMappingURL=index.js.map