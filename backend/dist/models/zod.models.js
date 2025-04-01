"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageZod = exports.profilePicZod = exports.signinZod = exports.signupZod = void 0;
const zod_1 = require("zod");
exports.signupZod = zod_1.z.object({
    fullName: zod_1.z.string().min(1),
    email: zod_1.z.string().min(1).email(),
    password: zod_1.z.string().min(6)
});
exports.signinZod = zod_1.z.object({
    email: zod_1.z.string().min(1).email(),
    password: zod_1.z.string().min(6)
});
//export type UserType = z.infer<typeof userZod>;
exports.profilePicZod = zod_1.z.object({
    profilePic: zod_1.z.string().min(1)
});
exports.messageZod = zod_1.z.object({
    text: zod_1.z.string().min(1).max(4096).optional(),
    image: zod_1.z.string().nullable().optional()
}).refine(data => data.image || data.text, {
    message: "Either text or image required"
});
