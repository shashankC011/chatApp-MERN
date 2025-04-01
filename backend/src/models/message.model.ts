import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiverId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String
    },
    image:{
        type: String
    }
},{timestamps: true}
); 

export const Message = mongoose.model("Message",messageSchema);