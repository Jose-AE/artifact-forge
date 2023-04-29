"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function verifyToken(req, res, next) {
    //const token = req.headers.authorization?.split(" ")[1];
    const token = req.cookies.token; //req.headers.cookie?.split("; ")[1].split("=")[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "JWT Invalid" });
    }
}
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map