import { Request } from "express";
import { User } from "../models/user.model";

export interface CustomReqObj extends Request{
    user?: User;
}