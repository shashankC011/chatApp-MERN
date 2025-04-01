"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.messageSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.messageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiverId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });
exports.Message = mongoose_1.default.model("Message", exports.messageSchema);
