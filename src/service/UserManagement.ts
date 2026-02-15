import { id, ID } from "repository/IRepository";
import { IIdentifiableUser } from "../models/Iuser";
import { createUserRepo, Userrepo } from "../repository/sqlite/User.repo";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";
import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { ServiceException } from "../util/exceptions/ServiceException";
import { IdentifiableUser, User } from "models/User.model";


export class UserManagement {
    private userRepo!: Userrepo;

   

   

    // Create user
    public async create(user: IIdentifiableUser): Promise<id> {
        this.validateUser(user);
        return (await this.getRepo()).create(user);
    }

    // Get user by id
    public async get(id: string): Promise<IIdentifiableUser> {
        try {
            const user =  (await this.getRepo()).get(id);
            return user;
        } catch (error) {
            throw new NotFoundException("User not found");
        }
    }

    // Get all users
    public async getAll(): Promise<IIdentifiableUser[]> {
        try {
            const users = await (await this.getRepo()).getALL();
            return users;
        } catch (error) {
            throw new ServiceException("Failed to fetch all users", error as Error);
        }
    }

    // Update user
    public async update(user: IIdentifiableUser): Promise<void> {
        this.validateUser(user);
         (await this.getRepo()).update(user);
    }

    // Delete user
    public async delete(id: string): Promise<void> {
        try {
             (await this.getRepo()).delete(id);
        } catch (error) {
            throw new NotFoundException("User not found");
        }
    }

    // Get user by email
    public async validate(email: string,password: string): Promise<IIdentifiableUser> {
        try {
            const user = await(await this.getRepo()).getUserByEmail(email);
            if(!user){
                throw new NotFoundException("User with email " + email + ' is not found');
            }
            if(password !== user.getPassword()){
                throw new BadRequestException("Invalid password");
            }
            return user;
        } catch (error) {
            throw new ServiceException("Failed to validate user", error as Error);
        }
    }

    // Validate user
    private validateUser(user: IIdentifiableUser): void {
        const email = user.getEmail();
        const name = user.getName();
        const password = user.getPassword();

        if (!name || !email || !password) {
            const details = {
                NameNotDefined: !name,
                EmailNotDefined: !email,
                PasswordNotDefined: !password
            };
            throw new BadRequestException("Invalid user: name, email, and password must be valid.", details);
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException("Invalid email format.", { email });
        }

        // Password validation (at least 6 characters)
        if (password.length < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.", { password });
        }
    }
    private async getRepo(){
    if(!this.userRepo){
        this.userRepo = await createUserRepo();
   
    }
    return this.userRepo;
}
}
