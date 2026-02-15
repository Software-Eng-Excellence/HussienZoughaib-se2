import { ID } from "repository/IRepository";
import { ROLE } from "../config/roles";

export interface IUser {
    getName(): string;
    getEmail(): string;
    getPassword(): string;
    getRole(): ROLE;
}

export interface IIdentifiableUser extends IUser, ID {

}
