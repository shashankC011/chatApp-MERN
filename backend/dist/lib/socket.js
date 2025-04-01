"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.io = exports.app = void 0;
exports.getUserSocketId = getUserSocketId;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});
exports.io = io;
;
const userSocketMap = {};
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    // in socket.io, query parameters can sometimes be parsed as an array instead of a single string.
    const userId = Array.isArray(socket.handshake.query.userId)
        ? socket.handshake.query.userId[0] // Take the first element if it's an array
        : socket.handshake.query.userId; // Otherwise, use it directly
    if (userId)
        userSocketMap[userId] = socket.id; //add another entry to the userSocketMap object
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); //broadcasts to all users an event called "getOnlineUsers" and passes all userIds to it
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        if (userId)
            delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
function getUserSocketId(userId) {
    return userSocketMap[userId];
}
