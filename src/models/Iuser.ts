import { ID } from "repository/IRepository";

export interface IUser {
    getName(): string;
    getEmail(): string;
    getPassword(): string;
    getRole(): string;
}

export interface IIdentifiableUser extends IUser, ID {

}
