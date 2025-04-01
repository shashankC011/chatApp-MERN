import { Request, Response } from "express";
import { User } from "../models/user.model";
import { profilePicZod, signinZod,signupZod } from "../models/zod.models";
import { zodInputError } from "../lib/utils.lib";
import bcrypt from "bcryptjs"
import { generateJwt } from "../lib/utils.lib";
import cloudinary from "../lib/cloudinary";
import { CustomReqObj } from "../lib/customRequestObj";

export const signup = async(req:Request,res:Response)=>{
    const user = signupZod.safeParse(req.body);
    if(!user.success){
        zodInputError(user.error,res);
        return;
    }   
    try{
        const {fullName,email,password} = user.data;
        const existingUser = await User.findOne({email: email});
        if(existingUser){
            res.status(400).json({message: "Email already exists"});
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })
        if(newUser){
            generateJwt(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
                createdAt: newUser.createdAt
            })
        }
        else{
            res.status(400).send({message: "INVALID USER DATA"})
        }
    }catch(err){
        console.error("ERROR IN SIGNUP CONTROLLER",err);
        throw new Error(`INTERNAL SERVER ERROR`);
    }
}

export const login = async(req:Request,res:Response)=>{
    const user = signinZod.safeParse(req.body);
    if(!user.success){
        zodInputError(user.error,res);
        return;
    }
    try{
        const {email,password} = user.data;
        const existingUser = await User.findOne({email});
        if(!existingUser){
            res.status(404).json({message: "INVALID CREDENTIALS"});
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password,existingUser.password);
        if(!isPasswordCorrect){
            res.status(404).json({message: "INVALID CREDENTIALS"});
            return;
        }
        generateJwt(existingUser._id,res);
        res.status(200).json({
                _id: existingUser._id,
                fullName: existingUser.fullName,
                email: existingUser.email,
                profilePic: existingUser.profilePic,
                createdAt: existingUser.createdAt
        })
    }catch(err){
        console.error("ERROR IN LOGIN CONTROLLER",err);
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

export const logout = (req:Request,res:Response)=>{
    try{
        //res.cookie("jwt","",{maxAge:0}); 
        res.clearCookie("jwt");
        res.status(200).json({message: "LOGGED OUT SUCCESSFULLY"});
    }
    catch(err){
        console.error("ERROR IN LOGOUT CONTROLLER",err);
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}

export const updateProfile = async(req:CustomReqObj,res:Response)=>{
    const parsedBody = profilePicZod.safeParse(req.body);
    if(!parsedBody.success){
        zodInputError(parsedBody.error,res);
        return;
    }
    try{
        const {profilePic} = parsedBody.data;
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        if(!req.user){
            res.status(401).json({message:"UNAUTHORIZED - NO SUCH USER EXISTS"});
            return;
        }
        const updatedUser = await User.findByIdAndUpdate(req.user._id,{profilePic: uploadResponse.secure_url},{new: true});
        res.status(200).json({message: "USER UPDATED SUCCESFULLY",updatedUser: updatedUser});
    }catch(err){
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
        console.error("ERROR IN UPDATE-PROFILE CONTROLLER",err);
    }
}

export const checkAuth = (req:CustomReqObj,res:Response)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(err){
        console.error("ERROR IN CHECKAUTH CONTROLLER",err);
        res.status(500).json({message: "INTERNAL SERVER ERROR"});
    }
}
