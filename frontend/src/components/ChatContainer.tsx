import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = ()=>{
    const{messages,getMessages, isMessageLoading,selectedUser,subscribeToMessages,unsubscribeFromMessages}= useChatStore();
    const{authUser}=useAuthStore();
    const messageEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(()=>{
        if(selectedUser){
            getMessages(selectedUser._id);
            subscribeToMessages();
            return ()=> unsubscribeFromMessages(); 
        }
    },[selectedUser,getMessages,subscribeToMessages,unsubscribeFromMessages])

    useEffect(()=>{
        //messageEndRef is made an actual reference to a div by putting it in the ref property and this is used to manipulate the dom element
        if(messageEndRef.current && messages){  //messageEndRef.current is used to check if we are refering to an actual dom element currently available 
            messageEndRef.current.scrollIntoView({behavior:"smooth"})  
        }
    },[messages])

    if(isMessageLoading){
        return(
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader/>
            <MessageSkeleton/>
            <MessageInput/>
        </div>
    )}

    return(
        <div className="flex flex-1 flex-col overflow-auto">
            <ChatHeader/>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message)=>{
                    return(
                        <div key={message._id} className={`chat ${message.senderId === authUser?._id?"chat-end":"chat-start"}`}ref={messageEndRef}>
                                <div className="chat-image avatar">
                                    <div className="size-10 rounded-full border">
                                        <img
                                            src={
                                                message.senderId === authUser?._id
                                                ?  authUser?.profilePic||"./avatar.png"
                                                : selectedUser?.profilePic || "./avatar.png"
                                            }
                                            alt="profile pic"/>
                                    </div>
                                </div>
                                <div className=" chat-footer mb-1">
                                    <time className="text-xs opacity-60 ml-1">{formatMessageTime(message.createdAt)}</time>
                                </div>
                                <div className="chat-bubble flex flex-col">
                                    {message.image && (
                                        <img 
                                            src={message.image}
                                            alt="Attachment"
                                            className="sm:max-w-[200px] rounded-md mb-2"
                                        />
                                    )}
                                    {message.text && <p>{message.text}</p>}
                                </div>
                        </div>
                    )
                })}
            </div>
            <MessageInput/>
        </div>
    )
}
export default ChatContainer;