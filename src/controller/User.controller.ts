import { NextFunction, Request, Response } from "express";
import { UserManagement } from "../service/UserManagement";
import { IIdentifiableUser } from "../models/Iuser";
import { JsonUserMapper } from "../mappers/User.mapper";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class UserController {
    constructor(private readonly userManagement: UserManagement) {

    }

    // Create user
    public async CreateUser(req: Request, res: Response): Promise<void> {
        const userData: IIdentifiableUser = new JsonUserMapper().map(req.body);

        if (!userData) {
            throw new BadRequestException("Invalid user data", {
                invalidData: req.body
            });
        }

        const userId = await this.userManagement.create(userData);
        const createdUser = await this.userManagement.get(userId);
        res.status(201).json({ message: "User created successfully", user: new JsonUserMapper().reversemap(createdUser as any) });
    }

    // Get user by id
    public async GetUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;

        if (!userId) {
            throw new BadRequestException("Id is required", {
                idNotDefined: true
            });
        }

        const user = await this.userManagement.get(userId);
        const target = new JsonUserMapper().reversemap(user as any);
        res.status(200).json({ message: `User ${userId} fetched successfully`, user: target });
    }

    // Get all users
    public async GetAllUsers(req: Request, res: Response): Promise<void> {
        const users = await this.userManagement.getAll();
        const result = users.map(user => new JsonUserMapper().reversemap(user as any ));
        res.status(200).json({ message: "Users fetched successfully", users: result });
    }

    // Update user
    public async UpdateUser(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException("Id is required to update user", {
                idNotDefined: true
            });
        }

        const userData: IIdentifiableUser = new JsonUserMapper().map(req.body);

        if (!userData) {
            throw new Error("Invalid user data");
        }

        if (userData.getId() !== id) {
            throw new BadRequestException("Id in body is different from id in param", {
                idNotSame: true,
                idInBody: userData.getId(),
                idInParam: id
            });
        }

        await this.userManagement.update(userData);
        res.status(200).json({ message: `User ${id} updated successfully` });
    }

    // Delete user
    public async DeleteUser(req: Request, res: Response): Promise<void> {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException("Id is required to delete user", {
                idNotDefined: true
            });
        }

        await this.userManagement.delete(id);
        res.status(200).json({ message: `User ${id} deleted successfully` });
    }
}
