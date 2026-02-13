import { UserManagement } from "../service/UserManagement";
import { AuthenticationService } from "../service/Authentication.Service";
import {  Request, Response } from "express";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { log } from "console";
import { AuthRequest } from "config/authRequest";
import logger from "../util/logger";
export class AuthController{
    constructor(private authService: AuthenticationService,private userService: UserManagement) {}
    public async login(req:Request,res:Response){
        const {email,password} = req.body;
        if(!email || !password){
            throw new BadRequestException("Email and password are required");
        }
        const userId= await this.userService.validate(email,password);
       this.authService.persisAuthentication(res,userId);
         logger.info('token generated and set in cookie');
        res.status(200).json('logged in successfully');
    }
    async logout(req:Request,res:Response){
            const auth_request=req as AuthRequest;
            this.authService.clearTokens(res);
            res.status(200).json({message:"Logged out successfully"});
        }
        
}
