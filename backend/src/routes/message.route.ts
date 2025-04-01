import express from "express";
import { authenticateJwt } from "../middlewares/jwt.auth";
import { getUsersForSideBar, getMessages, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/users",authenticateJwt,getUsersForSideBar);
router.get("/:id",authenticateJwt,getMessages);
router.post("/send/:id",authenticateJwt,sendMessage);

export default router;