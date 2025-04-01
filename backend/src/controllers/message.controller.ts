import { CustomReqObj } from "../lib/customRequestObj";
import { Response } from "express";
import { User } from "../models/user.model";
import { Message } from "../models/message.model";
import { messageZod } from "../models/zod.models";
import { zodInputError } from "../lib/utils.lib";
import cloudinary from "../lib/cloudinary";
import { getUserSocketId, io } from "../lib/socket";

export const getUsersForSideBar = async(req:CustomReqObj,res:Response)=>{
    try{
        const loggedInUserId = req.user?._id;
        const filteredUsers = await User.find({_id:{$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }catch(err){
        console.log("ERROR IN GETUSERSFORSIDEBAR CONTROLLER",err);
        res.status(500).json({error: "INTERNAL SERVER ERROR"});
    }
}

export const getMessages = async(req:CustomReqObj, res:Response)=>{
    try{
        const receiverId = req.params.id;
        const senderId = req.user?._id;
        const messages = await Message.find({
            $or: [
                {senderId: senderId,receiverId:receiverId}, 
                {senderId: receiverId, receiverId: senderId}
            ]
        })
        res.status(200).json(messages);
    }catch(err){
        console.error("ERROR IN GETMESSAGES CONTROLLER: ",err);
        res.status(500).json({error: "INTERNAL SERVER ERROR"});
    }
}

export const sendMessage = async(req:CustomReqObj,res:Response)=>{
    const message = messageZod.safeParse(req.body);
    if(!message.success){
        zodInputError(message.error,res);
        return;
    }
    try{    
        const {text,image} = message.data;
        const senderId = req.user?._id;
        const receiverId = req.params.id;
        let imageUrl;
        if(image){
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }
        const newMessage = new Message({senderId: senderId,receiverId:receiverId,text:text,image:imageUrl})
        await newMessage.save();

        //realtime functionality added here using socket.io
        if(receiverId){
            const receiverSocketID = getUserSocketId(receiverId.toString());
            if(receiverSocketID){
                io.to(receiverSocketID).emit("newMessage",newMessage);  //to receiverSocketId does not broadcast rather only sends to one user
            }
        }

        res.status(201).json(newMessage);
    }
    catch(err){
        console.log("ERROR IN SEND MESSAGE CONTROLLER",err);
        res.status(500).json({message:"INTERNAL SERVER ERROR"});
    }
}