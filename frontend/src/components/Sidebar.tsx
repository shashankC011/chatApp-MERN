import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";

import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Check, Users, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
const Sidebar = ()=>{
    const{getUsers,users,selectedUser,setSelectedUser} = useChatStore();
    const{onlineUsers}=useAuthStore();
    let{isUsersLoading} = useChatStore();
    const [showOnlineOnly,setShowOnlineOnly] = useState(false);

    
    useEffect(()=>{
        getUsers();
    },[getUsers]);


    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)): users;
    
    
    if(isUsersLoading) return <SidebarSkeleton/>
    
    return(
        <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
            <div className="border-b border-base-200 w-full p-5">
                <div className="flex gap-2 items-center">
                    <Users className="size-6"></Users>
                    <span className="font-medium hidden lg:block">Contacts</span>
                </div>
                {/*online filter*/}
                <div className="mt-3 hidden lg:flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={showOnlineOnly}
                            onChange={(e) => setShowOnlineOnly(e.target.checked)}
                            className="checkbox checkbox-sm"
                        />
                        <span className="text-sm">Show online only</span>
                    </label>
                    <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
                </div>
            </div>
            
            <div className="w-full py-3 overflow-y-auto">
                {filteredUsers.map((user)=>{
                    return(
                        <button
                        key={user._id}
                        onClick={()=>{setSelectedUser(user)}}
                        className={`w-full p-3 flex items-center gap-3 
                        hover:bg-base-300 transition-colors
                        ${selectedUser?._id == user._id ? "bg-base-300 ring-1 ring-base-300":""}`}>
                            <div className="relative mx-auto lg:mx-0">
                                <img 
                                src={user.profilePic || "./avatar.png"}
                                alt={user.fullName}
                                className="size-12 rounded-full object-cover"
                                />
                                {onlineUsers.includes(user._id)&&(
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500
                                    rounded-full ring-2 ring-zinc-900"
                                    />
                                )}
                            </div>
                            {/*additional info only for larger screens*/}
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullName}</div>
                                <div className="text-sm text-zinc-400">
                                    {/*could add last message here*/}
                                    {onlineUsers.includes(user._id)? "online":"offline"}
                                </div>
                            </div>
                            {/* todo add these with functionilty of adding and removing friends */}
                            {/* <Check></Check>
                            <X></X> */}
                        </button>
                    )
                })}

                {filteredUsers.length == 0 &&(
                    <div className="text-center text-zinc-500 py-4">No online users</div>
                )}
            </div>
        </aside>
    )
}

export default Sidebar;