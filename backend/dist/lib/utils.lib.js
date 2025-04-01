"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJwt = exports.zodInputError = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zodInputError = (zodError, res) => {
    const error = zodError.format();
    console.log("Invalid inputs: ", error);
    return res.status(400).json({ message: "Bad request(Invalid inputs): ", error }); //remove printing error in prod phase
};
exports.zodInputError = zodInputError;
const generateJwt = (userId, res) => {
    const secret = process.env.JWT_SECRET;
    const payload = { userId };
    if (secret) {
        const token = jsonwebtoken_1.default.sign(payload, secret, {
            expiresIn: "1d"
        });
        res.cookie("jwt", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV !== "development"
        });
    }
    else {
        console.log("NO JWT_SECRET IN ENV FILE");
        res.status(403).json({ message: "INTERNAL SERVER ERROR" });
    }
};
exports.generateJwt = generateJwt;
