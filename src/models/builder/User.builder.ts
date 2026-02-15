import { IIdentifiableUser } from "models/Iuser";
import { IdentifiableUser, User } from "../User.model";
import { ROLE } from "../../config/roles";

export class UserBuilder {
    private id!: string;
    private name!: string;
    private email!: string;
    private password!: string;
    private role!: ROLE

    public static createBuilder(): UserBuilder {
        return new UserBuilder();
    }

    setId(id: string): this {
        this.id = id;
        return this;
    }

    setName(name: string): this {
        this.name = name;
        return this;
    }

    setEmail(email: string): this {
        this.email = email;
        return this;
    }

    setPassword(password: string): this {
        this.password = password;
        return this;
    }
    setRole(role: ROLE): this {
        this.role = role;
        return this;
    }

    build(): User {
        const required = [this.id, this.name, this.email, this.password];
        for (const field of required) {
            if (field === undefined) {
                throw new Error("Missing required fields to build User");
            }
        }
        return new User(this.id, this.name, this.email, this.password,this.role);
    }
}

export class IdentifiableUserBuilder {
    private id!: string;
    private name!: string;
    private email!: string;
    private password!: string;
    private role!: ROLE

    static createBuilder(): IdentifiableUserBuilder {
        return new IdentifiableUserBuilder();
    }

    setId(id: string): IdentifiableUserBuilder {
        this.id = id;
        return this;
    }

    setName(name: string): IdentifiableUserBuilder {
        this.name = name;
        return this;
    }

    setEmail(email: string): IdentifiableUserBuilder {
        this.email = email;
        return this;
    }

    setPassword(password: string): IdentifiableUserBuilder {
        this.password = password;
        return this;
    }
    setRole(role: ROLE): IdentifiableUserBuilder {
        this.role = role;
        return this;
    }

    build(): IdentifiableUser {
        const required = [this.id, this.name, this.email, this.password];
        for (const field of required) {
            if (field === undefined) {
                throw new Error("Missing required fields to build IdentifiableUser");
            }
        }
        return new IdentifiableUser(this.id, this.name, this.email, this.password,this.role);
    }
}
