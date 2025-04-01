import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { AuthUser, Message } from "../lib/interfaces";
import { useAuthStore } from "./useAuthStore";

interface ChatStore{
    users: AuthUser[],
    messages: Message[],
    selectedUser: null|AuthUser,
    isUsersLoading: boolean,
    isMessageLoading: boolean,
    isSendingMessage: boolean,
    getUsers: ()=>void,
    getMessages: (userId:string)=>void,
    sendMessage:(data:any)=>void,
    subscribeToMessages: ()=>void,
    unsubscribeFromMessages: ()=>void,
    setSelectedUser:(user:AuthUser|null)=>void
};
export const useChatStore = create<ChatStore>((set,get)=>({
    users: [],
    messages: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessageLoading: false,
    isSendingMessage:false,
    getUsers: async()=>{
        set({isUsersLoading: true});
        try{
            const res = await axiosInstance.get("/messages/users");
            set({users: res.data});
        }catch(error){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message);
            }else{
                toast.error("Error getting Users");
            }
        }finally{
            set({isUsersLoading: false});
        }
    },
    getMessages:async(userId:string)=>{
        set({isMessageLoading: true});
        try{
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data});
        }catch(error){
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data.message);
            }else{
                toast.error("Error getting Messages");
            }
        }finally{
            set({isMessageLoading: false});
        }
    },
    sendMessage: async(data:any)=>{
        const{selectedUser,messages}= get();
        try {
            set({isSendingMessage:true})
            const res = await axiosInstance.post(`/messages/send/${selectedUser?._id}`,data);
            set({messages:[...messages,res.data]}); 
        } catch (error:unknown) {
            if(axios.isAxiosError(error)){
                toast.error(error.response?.data?.message);
            }
            else{
                toast.error("Some error occured");
            }
        }
        finally{
            set({isSendingMessage: false})
        }
    },
    subscribeToMessages: ()=>{
        //optimize later
        const {selectedUser} = get();
        if(!selectedUser)return;

        const socket = useAuthStore.getState().socket; //cannot do const {socket} = useAuthStore(); as useAuthStore is a hook and u cannot access hooks outside components

        socket?.on("newMessage",(newMessage:Message)=>{   //adds a listener
            
            const isMessageFromSelectedUser = newMessage.senderId ===selectedUser._id;
            if(!isMessageFromSelectedUser)return;
            
            set({messages: [...get().messages,newMessage]})
        });
    },

    unsubscribeFromMessages:()=>{
        const socket = useAuthStore.getState().socket;  
        socket?.off("newMessage");   //removes the listener
    },

    setSelectedUser:(user:AuthUser|null)=>{set({selectedUser:user})}
}));