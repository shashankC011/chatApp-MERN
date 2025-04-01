export interface Signup{
    fullName: string,
    email: string,
    password: string,
}
export interface Login{
    email: string,
    password: string
}

export interface AuthUser{
    _id: string,
    fullName:string,
    email:string,
    profilePic:string,
    createdAt:string
}

export interface ProfilePic{
    profilePic:string
}

export interface Message{
    _id: string,
    senderId: string,
    receiverId: string,
    text?: string,
    image?: string,
    messageId: string,
    createdAt: string,
    updatedAt: string
}