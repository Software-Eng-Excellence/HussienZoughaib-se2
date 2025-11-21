import sqlite3 from "sqlite3";
import { Database as SqliteDatabase, open } from "sqlite";
import config from "../../config";
import { DBException } from "../../util/exceptions/RepoException";
import logger from "../../util/logger";

export class ConnectionManager {
    private static db: SqliteDatabase | null = null;

    private constructor() {}

    public static async getConnection(): Promise<SqliteDatabase> {
        if (this.db !== null) {
            return this.db;
        }

        try {
            this.db = await open({
                filename: config.Storage.sqlite,
                driver: sqlite3.Database
            });

            logger.info("Database connection established");
            return this.db;

        } catch (error) {
            logger.error("Failed to connect to the database", error as Error);
            throw new DBException("Failed to connect to the database", error as Error);
        }
    }
}
