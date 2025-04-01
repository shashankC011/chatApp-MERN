import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin: ["http://localhost:5173"],
    },
});

interface UserSocketMap{
    [userId: string]: string;
};

const userSocketMap:UserSocketMap = {};

io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    // in socket.io, query parameters can sometimes be parsed as an array instead of a single string.
    const userId = Array.isArray(socket.handshake.query.userId)
    ? socket.handshake.query.userId[0] // Take the first element if it's an array
    : socket.handshake.query.userId; // Otherwise, use it directly

      if(userId) userSocketMap[userId] = socket.id; //add another entry to the userSocketMap object

      io.emit("getOnlineUsers",Object.keys(userSocketMap)); //broadcasts to all users an event called "getOnlineUsers" and passes all userIds to it

    socket.on("disconnect",()=>{
        console.log("A user disconnected", socket.id);
        if(userId)delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    });
});


export function getUserSocketId(userId:string){
    return userSocketMap[userId];
}

export {app,io,server};
