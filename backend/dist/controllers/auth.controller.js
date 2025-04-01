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
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
const zod_models_1 = require("../models/zod.models");
const utils_lib_1 = require("../lib/utils.lib");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_lib_2 = require("../lib/utils.lib");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = zod_models_1.signupZod.safeParse(req.body);
    if (!user.success) {
        (0, utils_lib_1.zodInputError)(user.error, res);
        return;
    }
    try {
        const { fullName, email, password } = user.data;
        const existingUser = yield user_model_1.User.findOne({ email: email });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists" });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });
        if (newUser) {
            (0, utils_lib_2.generateJwt)(newUser._id, res);
            yield newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt
            });
        }
        else {
            res.status(400).send({ message: "INVALID USER DATA" });
        }
    }
    catch (err) {
        console.error("ERROR IN SIGNUP CONTROLLER", err);
        throw new Error(`INTERNAL SERVER ERROR`);
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = zod_models_1.signinZod.safeParse(req.body);
    if (!user.success) {
        (0, utils_lib_1.zodInputError)(user.error, res);
        return;
    }
    try {
        const { email, password } = user.data;
        const existingUser = yield user_model_1.User.findOne({ email });
        if (!existingUser) {
            res.status(404).json({ message: "INVALID CREDENTIALS" });
            return;
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            res.status(404).json({ message: "INVALID CREDENTIALS" });
            return;
        }
        (0, utils_lib_2.generateJwt)(existingUser._id, res);
        res.status(200).json({
            _id: existingUser._id,
            fullName: existingUser.fullName,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
            createdAt: existingUser.createdAt
        });
    }
    catch (err) {
        console.error("ERROR IN LOGIN CONTROLLER", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        //res.cookie("jwt","",{maxAge:0}); 
        res.clearCookie("jwt");
        res.status(200).json({ message: "LOGGED OUT SUCCESSFULLY" });
    }
    catch (err) {
        console.error("ERROR IN LOGOUT CONTROLLER", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parsedBody = zod_models_1.profilePicZod.safeParse(req.body);
    if (!parsedBody.success) {
        (0, utils_lib_1.zodInputError)(parsedBody.error, res);
        return;
    }
    try {
        const { profilePic } = parsedBody.data;
        const uploadResponse = yield cloudinary_1.default.uploader.upload(profilePic);
        if (!req.user) {
            res.status(401).json({ message: "UNAUTHORIZED - NO SUCH USER EXISTS" });
            return;
        }
        const updatedUser = yield user_model_1.User.findByIdAndUpdate(req.user._id, { profilePic: uploadResponse.secure_url }, { new: true });
        res.status(200).json({ message: "USER UPDATED SUCCESFULLY", updatedUser: updatedUser });
    }
    catch (err) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
        console.error("ERROR IN UPDATE-PROFILE CONTROLLER", err);
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (err) {
        console.error("ERROR IN CHECKAUTH CONTROLLER", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
};
exports.checkAuth = checkAuth;
