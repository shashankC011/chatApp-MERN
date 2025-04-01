import {z} from "zod";

export const signupZod = z.object({
    fullName: z.string().min(1),
    email: z.string().min(1).email(),
    password: z.string().min(6)
});

export const signinZod = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(6)
});

//export type UserType = z.infer<typeof userZod>;

export const profilePicZod = z.object({
    profilePic: z.string().min(1)
})

export const messageZod = z.object({
    text: z.string().min(1).max(4096).optional(),
    image: z.string().nullable().optional()
}).refine(data=> data.image || data.text,{
    message:"Either text or image required"
})