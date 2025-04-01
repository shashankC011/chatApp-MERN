import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../lib/utils.lib";
import { User } from "../models/user.model";
import { CustomReqObj } from "../lib/customRequestObj";

export const authenticateJwt = async(req:CustomReqObj,res:Response,next:NextFunction)=>{
    const secret = process.env.JWT_SECRET;
    const token = req.cookies.jwt;
    if(!secret || !token){
        res.status(401).json({message: "UNAUTHORIZED - NO TOKEN PROVIDED"});
        return;
    }
    const decoded = jwt.verify(token,secret) as JwtPayload;
    if(!decoded){
        res.status(401).json({message: "UNAUTHORIZED - INVALID TOKEN"});
    }
    const {userId} = decoded;
    const user = await User.findById(userId).select("-password");
    if(!user){
        res.status(401).json({message:"UNAUTHORIZED - NO SUCH USER EXISTS"});
        return;
    }
    req.user = user;
    next();
}