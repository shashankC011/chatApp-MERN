import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, LoaderCircle, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = ()=>{
    const [text,setText] = useState("");
    const [imagePreview,setImagePreview] = useState<string| null >(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const{isSendingMessage,sendMessage} = useChatStore();

    const handleImageChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const file = e.target.files?.[0]
        if(!file){
            toast.error("Please select a file");
            return;
        }
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();

        reader.onload = ()=>{   //function called after reader has finished reading the data
            setImagePreview(reader.result as string); //Since readAsDataURL(file) returns a Base64 string, we can safely tell TypeScript to treat reader.result as a string
        };

        reader.readAsDataURL(file);  //reads the file and then onload is called(even tho it is written before(could be written after as well, anywhere works))
    }

    const handleMessageSend = async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();    //to stop page refresh as this is used in a refresh button
        if(!text.trim() && !imagePreview)return;

        try {
            await sendMessage({
                text: text.trim(),
                image: imagePreview
            });

            //clear
            setText("");
            setImagePreview(null);
            if(fileInputRef.current)fileInputRef.current.value="";
        } catch (error) {
            console.error("failed to send message:",error);  
            toast.error("failed to send message");  
        }
    }
    const removeImage = ()=>{
        setImagePreview(null);
        if(fileInputRef.current) fileInputRef.current.value = "";   //clear the input
    }

    return(
        <div className="p-4 w-full">
            {imagePreview&&(
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-zinc-700"/>
                            <button className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
                                flex items-center justify-center" onClick={removeImage}>
                                <X className="size-3"/>
                            </button>
                    </div>
                </div>
            )}
            <form onSubmit={handleMessageSend} className="flex items-center justify-center gap-2">
                <div className="flex-1 flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={text}
                        className="w-full input input-bordered rounded-lg input-sm sm:input-md"
                        onChange={(e)=>{setText(e.target.value)}}
                    />
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                        <button
                            type="button"    //when using buttons inside a form u need to specify this otherwise by default every button in a form is taken as a submit button and hence page refreshes
                            className={`hidden sm:flex btn btn-circle
                                        ${imagePreview?"text-emerald-500":"text-zinc-400"}`}
                                        onClick={()=>{fileInputRef.current?.click()}}>
                            <Image size={20}/>
                        </button>
                </div>
                <button
                    type="submit"
                    className="btn btn-sm btn-circle"
                    disabled={!text.trim() && !imagePreview}>
                        {!isSendingMessage?<Send size={22}/>:<LoaderCircle className="animate-spin" size={22}/>}
                </button>
            </form>
        </div>
    )
}
export default MessageInput;

