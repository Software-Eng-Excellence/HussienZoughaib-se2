import { IintCake } from "models/Cake.model";
import { id, Intiazable, IRepository } from "repository/IRepository";
import config from "config";
import { open } from "sqlite";
import { Database } from "sqlite3";
import logger from "../../util/logger";


import { DBException, ItemNotFoundException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import { ItemCategory } from "../../models/Iitem";
import { ConnectionManager } from "./ConnectionManger";
import { SqlCake, SQLITCAKEMAPPER } from "../../mappers/Cake.mapper";

import { error, log } from "winston";
const table_name=ItemCategory.Cake
const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS ${table_name} (
    id TEXT PRIMARY KEY NOT NULL,
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
    INSERT INTO ${table_name} (id, type, flavor, filling, size, layers, frosting_type, frosting_flavor, decoration_type, decoration_color, custom_message, shape, allergies, special_ingredients, package_type)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;
const GET_CAKE_BY_ID=`SELECT * FROM ${table_name} WHERE id=?;`;
const GET_CAKES=  `SELECT * FROM ${table_name};`;
const Delet_Cake_BYID=  `DELETE FROM ${table_name} WHERE id=?;`;
const UPDATE_CAKE = `
UPDATE ${table_name}
SET 
    type = ?,
    flavor = ?,
    filling = ?,
    size = ?,
    layers = ?,
    frosting_type = ?,
    frosting_flavor = ?,
    decoration_type = ?,
    decoration_color = ?,
    custom_message = ?,
    shape = ?,
    allergies = ?,
    special_ingredients = ?,
    package_type = ?
WHERE id = ?;
`;

export class CakeOrderRepo implements IRepository<IintCake>, Intiazable {
    //i put db inside the constructor since i want to make sure it open once
  

    async init(): Promise<void> {
        try {
            const connection =await ConnectionManager.getConnection();
            await connection.exec(CREATE_TABLE_QUERY);
            logger.info("cake table ensured in the database");
        } catch (error: unknown) {
            logger.error("Failed to initialize the repository", error as Error);
            throw new RepositoryInitializationException("Failed to initialize the repository", error as Error);
        }
    }

   async create(item: IintCake): Promise<id> {
        try{
            const  connection=await ConnectionManager.getConnection();
            await  connection.run(Insert_CAKE_QUERY, [
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



        }
        catch(error){
            logger.error("Failed to create cake", error as Error);
            throw new DBException("Failed to create cake", error as Error);
        }
    }

      async get(id: id): Promise<IintCake> {
      let connection;
      try{

        connection=await ConnectionManager.getConnection();
        const target=await connection.get<SqlCake>(GET_CAKE_BY_ID,id);
        if(!target){
            logger.info('cake not found');
            throw new ItemNotFoundException('cake not found ');
        }
    
        return new SQLITCAKEMAPPER().map(target);
        

      }
      catch(error){
        logger.error(error);
        throw new DBException('failed to fetch cake %o',error as Error);
      }
    }

   async getALL(): Promise<IintCake[]> {
        try{
            const connection=await ConnectionManager.getConnection();
            
            const cakes=await connection.all<SqlCake[]>(GET_CAKES);
            const mapper=new SQLITCAKEMAPPER();
            const results=cakes.map((cake)=>{
                return mapper.map(cake);

            })
            return results;

        }
        catch(error){
            logger.error(error);
            throw new DBException('canot fetch cakes',error as Error);
        }
    }

     async update(item: IintCake): Promise<void> {
        let connection;
        try{
            connection=await ConnectionManager.getConnection();
               const result = await connection.run(UPDATE_CAKE, [
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
            item.getId() // WHERE id = ?
        ]);
        }
         catch(error){
            logger.error(error);
            throw new DBException('failed to update',error as Error);
         }
    }

    async delete(id: id): Promise<void> {
        let connection;
    try{
        connection=await ConnectionManager.getConnection();
        await connection.run(Delet_Cake_BYID,id);


    }
    catch(error){
        logger.error(error);
        throw new DBException("failed to delet the cake",error as Error);
    }
    }
}