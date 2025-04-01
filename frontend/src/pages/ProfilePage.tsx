import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";


const ProfilePage = ()=>{
    const{authUser, isUpdatingProfile, updateProfile} = useAuthStore();
    const [selectedImg, setSelectedImg] = useState<string|null>(null);
    let createdDate;
    if(authUser){
        createdDate = new Date(authUser?.createdAt);
        
    }
    const handleImageUpload = (e:React.ChangeEvent<HTMLInputElement>)=>{
        //handling bigger images and allowing higher payload bandwidth and also compressing browser image libraries can be used to imporve this drastically
        let file;
        if(e.target.files){
            file = e.target.files[0];
        }
        if(!file)return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async()=>{
            const base64Image = reader.result;
            if (typeof base64Image === "string") {                    
                setSelectedImg(base64Image);
                await updateProfile({profilePic: base64Image});
            }}
    }
    if(authUser){
        return(
            <div className="h-screen pt-20">
                <div className="max-w-2xl mx-auto p-4 py-8">
                    <div className="bg-base-300 rounded-xl p-6 space-y-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-semibold ">Profile</h1>
                            <p className="mt-2">Your profile information</p>
                        </div>
                        <div className="flex flex-col items-center gap-4">    {/*stack items vertically*/}
                            <div className="relative">
                                <img
                                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                                    alt="Profile"
                                    className="size-32 rounded-full object-cover border-2"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className={`
                                    absolute bottom-0 right-0 
                                    bg-base-content hover:scale-105
                                    p-2 rounded-full cursor-pointer 
                                    transition-all duration-200
                                    ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                                    `}
                                >
                                    <Camera className="w-5 h-5 text-base-200" />
                                    <input
                                    type="file"
                                    id="avatar-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUpdatingProfile}
                                    />
                                </label>
                            </div>
                            <p className="text-sm text-zinc-400">
                                {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
                            </p> 
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm flex items-center gap-2">
                                <User className="bg-base-400 size-4" />
                                <p className=" text-zinc-400"> Email Address</p>
                            </div>
                            <p className="px-4 py-2 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-sm gap-2">
                                <Mail className="size-4 "></Mail>
                                <p className=" text-zinc-400"> Email Address</p>
                            </div>
                            <p className="px-4 py-2 rounded-lg bg-base-200 border">{authUser?.email}</p>
                        </div>
                    </div>
                    <div className="mt-6 bg-base-300 rounded-xl p-6 space-y-2">
                        {/*Acount information*/}
                        <h2 className="text-lg font-medium ">Account Information</h2>
                        <div className="flex justify-between pt-8 text-sm">
                            <p>Memeber Since</p>
                            <p className="pl-4">  {createdDate? 
                                createdDate.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) 
                                : "Data not available"}
                            </p>  
                        </div>
                        <div className="w-full bg-base-100 py-0.5"></div>
                        <div className="flex justify-between text-sm">
                            <p>Account status</p>
                            <p className="text-green-500">Active</p>
                        </div>
                    </div>
                </div>  
            </div>
        )
    }
}
export default ProfilePage;    