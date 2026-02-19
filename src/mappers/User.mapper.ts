import { IMapper } from "./IMapper";
import { IdentifiableUserBuilder } from "../models/builder/User.builder";

import { IdentifiableUser } from "models/User.model";
import { idGenerater } from "../util/idGenerater";
import { ROLE, toRole } from "../config/roles";

export interface SQLUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
}

export class SQLUserMapper implements IMapper<SQLUser, IdentifiableUser> {
    map(input: SQLUser): IdentifiableUser {
        return IdentifiableUserBuilder
            .createBuilder()
            .setId(input.id)
            .setName(input.name)
            .setEmail(input.email)
            .setPassword(input.password)
            .setRole(toRole(input.role))
            .build();
    }

    reversemap(input: IdentifiableUser): SQLUser {
        return {
            id: input.getId(),
            name: input.getName(),
            email: input.getEmail(),
            password: input.getPassword(),
            role: input.getRole()
        };
    }
}

export interface JsonUser {
    name: string;
    email: string;
    password: string;
    role?: ROLE;
}

export class JsonUserMapper implements IMapper<JsonUser, IdentifiableUser> {
    map(input: JsonUser): IdentifiableUser {
        return IdentifiableUserBuilder
            .createBuilder()
            .setId(idGenerater('user'))
            .setName(input.name)
            .setEmail(input.email)
            .setPassword(input.password)
            .setRole(input.role ? toRole(input.role) : ROLE.user)
            .build();
    }

    reversemap(input: IdentifiableUser): JsonUser {
        return {
            name: input.getName(),
            email: input.getEmail(),
            password: input.getPassword(),
            role: input.getRole()
        };
    }
}
