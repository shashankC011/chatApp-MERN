import mongoose from "mongoose";



export const connectDb = async()=>{
    try{
        if(!process.env.MONGODB_URI){
            throw new Error("mongoDb connection string not provided");
        } 
        const con = await mongoose.connect(process.env.MONGODB_URI,{
            dbName: "chat-app"
    })
    console.log("connected to database");
    }
    catch(error){
        console.log("failed to connect to database, error: ",error);
    }
}


