import express, { Request, Response } from "express";
import { signup,login,logout, updateProfile, checkAuth } from "../controllers/auth.controller";
import { authenticateJwt } from "../middlewares/jwt.auth";

const router = express.Router();

router.post("/signup",signup)
router.post("/login",login)
router.post("/logout",logout)
router.put("/update-profile",authenticateJwt,updateProfile);
router.get("/check",authenticateJwt,checkAuth)

export default router;