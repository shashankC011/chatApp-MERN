import express from "express";
import authRoutes from "./routes/auth.route";
import dotenv from "dotenv";
import { connectDb } from "./lib/db.lib";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route";
import{app,io,server} from "./lib/socket"
import cors from "cors";



dotenv.config();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));  // Increase JSON body limit to 10MB
app.use(express.urlencoded({ extended: true, limit: "10mb" }));  
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))



app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);



server.listen(PORT,()=>{
    console.log(`LISTENING ON PORT ${PORT}`)
    connectDb();
})