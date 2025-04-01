"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_auth_1 = require("../middlewares/jwt.auth");
const message_controller_1 = require("../controllers/message.controller");
const router = express_1.default.Router();
router.get("/users", jwt_auth_1.authenticateJwt, message_controller_1.getUsersForSideBar);
router.get("/:id", jwt_auth_1.authenticateJwt, message_controller_1.getMessages);
router.post("/send/:id", jwt_auth_1.authenticateJwt, message_controller_1.sendMessage);
exports.default = router;
