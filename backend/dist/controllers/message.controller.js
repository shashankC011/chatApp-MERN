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
exports.sendMessage = exports.getMessages = exports.getUsersForSideBar = void 0;
const user_model_1 = require("../models/user.model");
const message_model_1 = require("../models/message.model");
const zod_models_1 = require("../models/zod.models");
const utils_lib_1 = require("../lib/utils.lib");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const socket_1 = require("../lib/socket");
const getUsersForSideBar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const filteredUsers = yield user_model_1.User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (err) {
        console.log("ERROR IN GETUSERSFORSIDEBAR CONTROLLER", err);
        res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
});
exports.getUsersForSideBar = getUsersForSideBar;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const receiverId = req.params.id;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const messages = yield message_model_1.Message.find({
            $or: [
                { senderId: senderId, receiverId: receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });
        res.status(200).json(messages);
    }
    catch (err) {
        console.error("ERROR IN GETMESSAGES CONTROLLER: ", err);
        res.status(500).json({ error: "INTERNAL SERVER ERROR" });
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const message = zod_models_1.messageZod.safeParse(req.body);
    if (!message.success) {
        (0, utils_lib_1.zodInputError)(message.error, res);
        return;
    }
    try {
        const { text, image } = message.data;
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const receiverId = req.params.id;
        let imageUrl;
        if (image) {
            const uploadedImage = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }
        const newMessage = new message_model_1.Message({ senderId: senderId, receiverId: receiverId, text: text, image: imageUrl });
        yield newMessage.save();
        //realtime functionality added here using socket.io
        if (receiverId) {
            const receiverSocketID = (0, socket_1.getUserSocketId)(receiverId.toString());
            if (receiverSocketID) {
                socket_1.io.to(receiverSocketID).emit("newMessage", newMessage); //to receiverSocketId does not broadcast rather only sends to one user
            }
        }
        res.status(201).json(newMessage);
    }
    catch (err) {
        console.log("ERROR IN SEND MESSAGE CONTROLLER", err);
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
});
exports.sendMessage = sendMessage;
