"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_lib_1 = require("./lib/db.lib");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const socket_1 = require("./lib/socket");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const PORT = process.env.PORT;
socket_1.app.use(express_1.default.json({ limit: "10mb" })); // Increase JSON body limit to 10MB
socket_1.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
socket_1.server.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`);
    (0, db_lib_1.connectDb)();
});
