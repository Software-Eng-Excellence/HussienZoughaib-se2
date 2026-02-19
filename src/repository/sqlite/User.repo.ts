import { IIdentifiableUser } from "models/Iuser";
import { id, Intiazable, IRepository } from "repository/IRepository";

import { DBException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManger";
import { SQLUserMapper, SQLUser } from "../../mappers/User.mapper";
import { IdentifiableUser } from "../../models/User.model";
import { idGenerater } from "../../util/idGenerater";
import { ROLE } from "../../config/roles"

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
`;

const ALTER_TABLE_QUERY = `
ALTER TABLE users ADD COLUMN role TEXT DEFAULT '${ROLE.user}';

`;

const INSERT_USER_QUERY = `
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?);
`;

const GET_USER_BY_ID_QUERY = `
    SELECT * FROM users WHERE id = ?;
`;

const GET_ALL_USERS_QUERY = `
    SELECT * FROM users;
`;

const UPDATE_USER_QUERY = `
    UPDATE users
    SET name = ?, email = ?, password = ?, role = ?
    WHERE id = ?;
`;

const DELETE_USER_BY_ID_QUERY = `
    DELETE FROM users WHERE id = ?;
`;

const GET_USER_BY_EMAIL_QUERY = `
    SELECT * FROM users WHERE email = ?;
`;

export class Userrepo implements IRepository<IIdentifiableUser>, Intiazable {
    constructor() {

    }

    async init(): Promise<void> {
        try {
            const connection = await ConnectionManager.getConnection();
            await connection.exec(CREATE_TABLE_QUERY);
            // Check if role column exists before adding it
            const columnExists = await connection.get(`PRAGMA table_info(users)`) as any;
            const hasRoleColumn = columnExists && (await connection.all(`PRAGMA table_info(users)`) as any[]).some((col: any) => col.name === 'role');
            if (!hasRoleColumn) {
                await connection.exec(ALTER_TABLE_QUERY);
            }
            logger.info("Users table ensured in the database");
        } catch (error: unknown) {
            logger.error("Failed to initialize the repository", error as Error);
            throw new RepositoryInitializationException("Failed to initialize the repository", error as Error);
        }
    }

    async create(user: IIdentifiableUser): Promise<id> {
        let connection;
        const id=idGenerater('user');
        try {
            connection = await ConnectionManager.getConnection();
            await connection.run(INSERT_USER_QUERY, [
                id,
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole()
            ]);
            logger.info(`User created with id ${id}`);
            return id;
        } catch (error) {
            logger.error(error);
            throw new DBException('ERROR during creation', error as Error);
        }
    }

    async get(id: id): Promise<IIdentifiableUser> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();
            const target = await connection.get<SQLUser>(GET_USER_BY_ID_QUERY, id);
            if (!target) {
                logger.error('user not found');
                throw new Error("user of id " + id + ' is not found');
            }
            return new SQLUserMapper().map(target);
        } catch (error) {
            logger.error(error);
            throw new DBException('ERROR fetching the user of id %o', error as Error);
        }
    }

    async getALL(): Promise<IIdentifiableUser[]> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();
            const users = await connection.all<SQLUser[]>(GET_ALL_USERS_QUERY);
            const mapper = new SQLUserMapper();
            const result = users.map((user) => {
                return mapper.map(user);
            });
            return result;
        } catch (error) {
            logger.error(error);
            throw new DBException('error fetching all users %o', error as Error);
        }
    }

    async update(user: IIdentifiableUser): Promise<void> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();
            await connection.run(UPDATE_USER_QUERY, [
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getId()
            ]);
            logger.info('update success');
        } catch (error) {
            logger.error(error);
            throw new DBException('ERROR during update', error as Error);
        }
    }

    async delete(id: id): Promise<void> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();
            await connection.run(DELETE_USER_BY_ID_QUERY, id);
            logger.info(`User deleted with id ${id}`);
        } catch (error) {
            logger.error(error);
            throw new DBException('ERROR during deletion', error as Error);
        }
    }

    async getUserByEmail(email: string): Promise<IIdentifiableUser> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();
            const target = await connection.get<SQLUser>(GET_USER_BY_EMAIL_QUERY, email);
            if (!target) {
                logger.error('user not found');
                throw new Error("user with email " + email + ' is not found');
            }
            return new SQLUserMapper().map(target);
        } catch (error) {
            logger.error(error);
            throw new DBException('ERROR fetching the user by email %o', error as Error);
        }
    }
}
export async function createUserRepo(): Promise<Userrepo> {
    const repo = new Userrepo();
    await repo.init();
    return repo;
}