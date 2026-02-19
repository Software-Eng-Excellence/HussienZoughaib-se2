import { IintCake } from "models/Cake.model";
import { id, Intiazable, IRepository } from "repository/IRepository";

import logger from "../../util/logger";


import { DBException, ItemNotFoundException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import { ItemCategory } from "../../models/Iitem";
import { ConnectionManager } from "./ConnectionManager";
import { SqlCake, SQLITCAKEMAPPER } from "../../mappers/Cake.mapper";

import { error, log } from "winston";
const table_name=ItemCategory.Cake
const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS ${table_name} (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    flavor TEXT NOT NULL,
    filling TEXT NOT NULL,
    size INTEGER NOT NULL,
    layers INTEGER NOT NULL,
    frosting_type TEXT NOT NULL,
    frosting_flavor TEXT NOT NULL,
    decoration_type TEXT NOT NULL,
    decoration_color TEXT NOT NULL,
    custom_message TEXT,
    shape TEXT NOT NULL,
    allergies TEXT,
    special_ingredients TEXT,
    package_type TEXT NOT NULL
);
`;

const Insert_CAKE_QUERY = `
INSERT INTO ${table_name} 
(id, type, flavor, filling, size, layers, frosting_type, frosting_flavor, decoration_type, decoration_color, custom_message, shape, allergies, special_ingredients, package_type)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);
`;

const GET_CAKE_BY_ID=`SELECT * FROM ${table_name} WHERE id=$1;`;
const GET_CAKES=  `SELECT * FROM ${table_name};`;
const Delet_Cake_BYID=  `DELETE FROM ${table_name} WHERE id=$1;`;
const UPDATE_CAKE = `
UPDATE ${table_name}
SET 
    type = $1,
    flavor = $2,
    filling = $3,
    size = $4,
    layers = $5,
    frosting_type = $6,
    frosting_flavor = $7,
    decoration_type = $8,
    decoration_color = $9,
    custom_message = $10,
    shape = $11,
    allergies = $12,
    special_ingredients = $13,
    package_type = $14
WHERE id = $15;
`;



export class CakeOrderRepp implements IRepository<IintCake>, Intiazable {
    //i put db inside the constructor since i want to make sure it open once
  

  async init(): Promise<void> {
    let connection;

    try {
        connection = await ConnectionManager.getConnection();
        await connection.query(CREATE_TABLE_QUERY);

        logger.info("cake table ensured in the database");

    } catch (error) {
        logger.error("Failed to initialize the repository", error as Error);
        throw new RepositoryInitializationException(
            "Failed to initialize the repository",
            error as Error
        );

    } finally {
        if (connection) connection.release(); 
    }
}


   async create(item: IintCake): Promise<id> {
    let connection;

    try {
        connection = await ConnectionManager.getConnection();

        await connection.query(Insert_CAKE_QUERY, [
            item.getId(),
            item.getType(),
            item.getFlavor(),
            item.getFilling(),
            item.getSize(),
            item.getLayer(),
            item.getFrostingType(),
            item.getFrostingFlavor(),
            item.getDecType(),
            item.getDecColor(),
            item.getCustomMessage(),
            item.getShape(),
            item.getAllergies(),
            item.getSpecialIngredients(),
            item.getPackageType()
        ]);

        logger.info(`Cake created with id ${item.getId()}`);
        return item.getId();

    } catch (error) {
        logger.error("Failed to create cake", error as Error);
        throw new DBException("Failed to create cake", error as Error);

    } finally {
        if (connection) connection.release();
    }
}


     async get(id: id): Promise<IintCake> {
    let connection;

    try {
        connection = await ConnectionManager.getConnection();

        const result = await connection.query<SqlCake>(GET_CAKE_BY_ID, [id]);
        const target = result.rows[0];

        if (!target) {
            logger.info("cake not found");
            throw new ItemNotFoundException("cake not found");
        }

        return new SQLITCAKEMAPPER().map(target);

    } catch (error) {
        logger.error(error);
        throw new DBException("failed to fetch cake", error as Error);

    } finally {
        if (connection) connection.release();
    }
}

async getALL(): Promise<IintCake[]> {
    let connection;
    try {
        connection = await ConnectionManager.getConnection();

        const result = await connection.query<SqlCake>(GET_CAKES);
        const rows = result.rows;

        const mapper = new SQLITCAKEMAPPER();
        return rows.map(cake => mapper.map(cake));

    } catch (error) {
        logger.error(error);
        throw new DBException("cannot fetch cakes", error as Error);

    } finally {
        if (connection) connection.release();
    }
}

async update(item: IintCake): Promise<void> {
    let connection;
    try {
        connection = await ConnectionManager.getConnection();

        await connection.query(UPDATE_CAKE, [
            item.getType(),
            item.getFlavor(),
            item.getFilling(),
            item.getSize(),
            item.getLayer(),
            item.getFrostingType(),
            item.getFrostingFlavor(),
            item.getDecType(),
            item.getDecColor(),
            item.getCustomMessage(),
            item.getShape(),
            item.getAllergies(),
            item.getSpecialIngredients(),
            item.getPackageType(),
            item.getId()
        ]);

        logger.info(`Cake updated: ${item.getId()}`);

    } catch (error) {
        logger.error(error);
        throw new DBException("failed to update", error as Error);

    } finally {
        if (connection) connection.release();
    }
}

    async delete(id: id): Promise<void> {
    let connection;

    try {
        connection = await ConnectionManager.getConnection();

        await connection.query(Delet_Cake_BYID, [id]);

        logger.info(`Cake deleted: ${id}`);

    } catch (error) {
        logger.error(error);
        throw new DBException("failed to delete the cake", error as Error);

    } finally {
        if (connection) connection.release();
    }
}

}