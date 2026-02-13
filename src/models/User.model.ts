import { id } from "repository/IRepository";
import { IIdentifiableUser, IUser } from "./Iuser";

export class User implements IUser {
    private id: string;
    private name: string;
    private email: string;
    private password: string;
    private role: string;

    constructor(id: string, name: string, email: string, password: string, role: string = 'user') {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getId(): string {
        return this.id;
    }

    getRole(): string {
        return this.role;
    }
}

export class IdentifiableUser implements IIdentifiableUser {
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: string = 'user'
    ) {

    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getId(): id {
        return this.id;
    }
    getRole():string{
        return this.role;
    }
}
