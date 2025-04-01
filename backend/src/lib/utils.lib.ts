import {z,ZodError} from "zod";
import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export interface JwtPayload {
    userId: string;
    iat: number;
    exp: number;
  }

export const zodInputError = (zodError:ZodError,res:Response)=>{
    const error = zodError.format();
    console.log("Invalid inputs: ",error);
    return res.status(400).json({message:"Bad request(Invalid inputs): ",error})   //remove printing error in prod phase
}



export const generateJwt = (userId:mongoose.Types.ObjectId,res:Response)=>{
const secret = process.env.JWT_SECRET;
const payload = {userId}
if(secret){
        const token = jwt.sign(payload,secret,{
            expiresIn:"1d"
        })
        res.cookie("jwt",token,{
            maxAge: 24*60*60*1000,
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV !== "development"
        })
    }
    else{
        console.log("NO JWT_SECRET IN ENV FILE");
        res.status(403).json({message:"INTERNAL SERVER ERROR"});
    }
}