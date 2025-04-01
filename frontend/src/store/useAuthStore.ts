import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { Signup, AuthUser, Login, ProfilePic } from "../lib/interfaces";
import toast from "react-hot-toast";
import axios from "axios";
import io from "socket.io-client";


const BASE_URL = "http://localhost:5001";


interface AuthStore{
    authUser: AuthUser|null,
    isSigningUp:boolean,
    isLoggingIn:boolean,
    isUpdatingProfile:boolean,
    isCheckingAuth:boolean,
    onlineUsers:string[],
    checkAuth: ()=>Promise <void>,
    signup: (data:Signup)=>Promise<void>,
    login: (data:Login)=>Promise<void>,
    logout: ()=>Promise<void>,
    updateProfile: (data:ProfilePic)=>Promise<void>,
    connectSocket: ()=> void,
    disconnectSocket: ()=> void,
    socket: null | SocketIOClient.Socket
}


export const useAuthStore = create<AuthStore>((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,


    checkAuth: async()=>{
        try{
            const res = await axiosInstance.get("/auth/check", {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
            withCredentials: true,
        });
            set({authUser: res.data});
            get().connectSocket();
        }catch(err){
            console.log("Error in Check Auth: ",err);
            set({authUser: null});
        }finally{
            set({isCheckingAuth: false});
        }
    },
    signup: async(data:Signup)=>{
        set({isSigningUp: true}) 
        try{            
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data})
            get().connectSocket();
            toast.success("Signed up successfully.");
        }catch(err:unknown){
            if(axios.isAxiosError(err)){
                toast.error(err.response?.data?.message||"An error occured");
            }
            else{
                toast.error("Something went wrong");
            }
        }finally{
            set({isSigningUp:false})
        }
    },
    login: async(data:Login)=>{
        try{
            set({isLoggingIn:true});
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data})
            toast.success("Signed in successfully,");
            get().connectSocket();
            console.log(res.data);
        }catch(err){
            if(axios.isAxiosError(err)){
                toast.error(err.response?.data?.message || "An error occured");
            }else{
                toast.error("Something went wrong");
            }
        }finally{
            set({isLoggingIn:false});
        }
    },
    logout: async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            // Clear local/session storage
            localStorage.clear();
            sessionStorage.clear();

            // Force reload to reset state completely
            window.location.href = "/login";
            toast.success("Logged out successfully")

            get().disconnectSocket();

        }catch(err){
            if(axios.isAxiosError(err)){
                toast.error(err.response?.data?.messsage||"An error occured");
            }
            else{
                toast.error("Something went wrong")
            }
        }
    },
    updateProfile: async(data:ProfilePic)=>{
        try{
            set({isUpdatingProfile:true});
            console.log(data);
            const res = await axiosInstance.put("/auth/update-profile",data);
            toast.success("Profile updated successfully");
            set({authUser:res.data});
        }catch(err){
            console.log(err);
            if(axios.isAxiosError(err)){
                toast.error(err.request?.data?.messasge||"An error occured");
            }else{
                toast.error("Something went wrong");
            }
        }finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket: ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected)return;

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id
            }
        });        
        socket.connect();

        socket.on("getOnlineUsers",(userIds:string[])=>{    //getOnlineUsers event from backend which passes all keys of the userSocketMap object
            set({onlineUsers: userIds});
        })
        set({socket: socket});
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket?.disconnect();
    }
}))