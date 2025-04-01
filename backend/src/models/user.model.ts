import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required :true,
            unique: true
        },
        fullName:{
            type: String,
            required :true,
        },
        password:{
            type: String,
            minLength: 6,
            required: true
        },
        profilePic:{
            type: String,
            default: ""
        },
    },
    {timestamps: true }
)

export interface User{
    email: String,
    fullName: String,
    password: String,
    profilePic: String,
    _id: mongoose.Types.ObjectId
}



export const User = mongoose.model("User",userSchema);