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
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const authenticateJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.jwt;
    if (!secret || !token) {
        res.status(401).json({ message: "UNAUTHORIZED - NO TOKEN PROVIDED" });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, secret);
    if (!decoded) {
        res.status(401).json({ message: "UNAUTHORIZED - INVALID TOKEN" });
    }
    const { userId } = decoded;
    const user = yield user_model_1.User.findById(userId).select("-password");
    if (!user) {
        res.status(401).json({ message: "UNAUTHORIZED - NO SUCH USER EXISTS" });
        return;
    }
    req.user = user;
    next();
});
exports.authenticateJwt = authenticateJwt;
