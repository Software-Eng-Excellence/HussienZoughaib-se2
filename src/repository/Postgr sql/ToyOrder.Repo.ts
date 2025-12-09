import { ItemCategory } from "../../models/Iitem";
import { IintToy } from "../../models/Toy.model";
import { id, Intiazable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import logger from "../../util/logger";
import { DBException, ItemNotFoundException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import { SqlToy, SQLTOYMAPPER } from "../../mappers/Toy.mapper";

const table_name=ItemCategory.Toy;
const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS toy (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    age_group INTEGER NOT NULL,
    brand TEXT NOT NULL,
    material TEXT NOT NULL,
    batteries_required BOOLEAN NOT NULL,
    educational BOOLEAN NOT NULL
);
`;

const Insert_Toy_QUERY = `
INSERT INTO toy 
(id, type, age_group, brand, material, batteries_required, educational)
VALUES ($1, $2, $3, $4, $5, $6, $7);
`;

const UPDATE_TOY_BYID = `
UPDATE toy
SET
  type = $1,
  age_group = $2,
  brand = $3,
  material = $4,
  batteries_required = $5,
  educational = $6
WHERE id = $7;
`;

const DELTE_TOY_BYID = `
DELETE FROM toy
WHERE id = $1;
`;

const GET_TOY_BYID = `
SELECT
  id,
  type,
  age_group AS "ageGroup",
  brand,
  material,
  batteries_required AS "batteriesRequired",
  educational
FROM toy
WHERE id = $1;
`;

const GET_TOYS = `
SELECT
  id,
  type,
  age_group AS "ageGroup",
  brand,
  material,
  batteries_required AS "batteriesRequired",
  educational
FROM toy;
`;

export class ToyOrderRepo implements IRepository<IintToy>,Intiazable {
  async   init(): Promise<void> {
       let connection;

    try {
        connection = await ConnectionManager.getConnection();
        await connection.query(CREATE_TABLE_QUERY);

        logger.info("Toy table ensured in the database");

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
    async create(item: IintToy): Promise<id> {
       let connection;

    try {
        connection = await ConnectionManager.getConnection();

        await connection.query(Insert_Toy_QUERY, [
            item.getId(),
            item.getType(),
            item.getAgeGroup(),
            item.getBrand(),
            item.getMaterial(),
            item.isBatteriesRequired(),
            item.isEducational()   
        ]);

        logger.info(`Cake Toy with id ${item.getId()}`);
        return item.getId();

    } catch (error) {
        logger.error("Failed to create cake", error as Error);
        throw new DBException("Failed to create cake", error as Error);

    } finally {
        if (connection) connection.release();
    }
    }
    async get(id: id): Promise<IintToy> {
       let connection;
       try{
        connection=await ConnectionManager.getConnection();
          const result = await connection.query<SqlToy>(GET_TOY_BYID, [id]);
        const target = result.rows[0];

        if (!target) {
            logger.info("cake not found");
            throw new ItemNotFoundException("cake not found");
        }

        return new SQLTOYMAPPER().map(target);
       }
       catch(error){
            logger.error(error);
        throw new DBException("failed to fetch cake", error as Error);
       }
       finally{
            if (connection) connection.release();

       }
    }
    async getALL(): Promise<IintToy[]> {
     let connection;
     try{
          connection = await ConnectionManager.getConnection();
        
                const result = await connection.query<SqlToy>(GET_TOYS);
                const rows = result.rows;
        
                const mapper = new SQLTOYMAPPER();
                return rows.map(toy => mapper.map(toy));
        

     }
     catch(error){
        logger.error(error);
        throw new DBException("cannot fetch cakes", error as Error)
     }
     finally{
                 if (connection) connection.release();
     }
    }
     async update(item: IintToy): Promise<void> {
   let connection;
   try{
    connection= await ConnectionManager.getConnection();
         await  connection.query(UPDATE_TOY_BYID, [
            item.getType(),
            item.getAgeGroup(),
            item.getBrand(),
            item.getMaterial(),
            item.isBatteriesRequired(),
            item.isEducational(),
            item.getId()
        ]);

        logger.info(`Toy updated: ${item.getId()}`);

   }
   catch(error){
    logger.error(error);
        throw new DBException("failed to update", error as Error);

   }
   finally{

     if (connection) connection.release();
   }
    }
    async delete(id: id): Promise<void> {
        let connection;
        try{
            connection=await ConnectionManager.getConnection();
            await connection.query(DELTE_TOY_BYID,[id]);
                   logger.info(`Toy deleted: ${id}`);
            

        }
        catch(error){
              logger.error(error);
        throw new DBException("failed to delete the cake", error as Error);

        }
        finally{
              if (connection) connection.release();

        }
      
    }
    
}