import { IIdentfaibleItem, ItemCategory } from "models/Iitem";
import { IIdentfaibleOrderItem, IOrder } from "models/Iorder";

import { id, Intiazable, IRepository } from "repository/IRepository";
import { open } from "sqlite";
import { Database } from "sqlite3";
import { DBException, ItemNotFoundException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManager";
import { SQLOrder, SQLORDERMAPPER } from "../../mappers/Order.mapper";
import { error, ExceptionHandler } from "winston";

//1step one create the table if not exists

const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  price INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  item_category TEXT NOT NULL,
  item_id TEXT NOT NULL
);
`;
const INSERT_ORDER_QUERY = `
INSERT INTO orders (id, price, quantity, item_category, item_id)
VALUES ($1, $2, $3, $4, $5);
`;

const GET_ORDER_BY_ID_QUERY=`
    SELECT * FROM orders WHERE id=$1;
`;
const GET_ORDERS='SELECT * FROM orders where  item_category =$1 ;';
// ...existing code...
const DELETE_ORDER_BY_ID = `DELETE FROM orders WHERE id = $1;`;
// ...existing code...
const UPDATE_ORDER= `
UPDATE orders
SET
quantity=?,price=$1,item_category=$2,item_id=$3 WHERE id=$4;

`;
//3 this is why i implented intiazable to make sure init is there
export class Orderrep implements IRepository<IIdentfaibleOrderItem>, Intiazable {
  
    constructor(private readonly itemRepo: IRepository<IIdentfaibleItem> & Intiazable){
    

        
      

    }
    //2 open the connection and make sure tabke exists and init is in the interface intiazable
    async init(){
        let connection;
        try{
         connection= await ConnectionManager.getConnection();
       await  connection.query( CREATE_TABLE_QUERY);
       await this.itemRepo.init();
       logger.info("Orders table ensured in the database");
    }
    catch(error:unknown){
        logger.error("Failed to initialize the repository", error as Error);
        throw new  RepositoryInitializationException("Failed to initialize the repository", error as Error);
    }
    finally{
         if (connection) connection.release(); 
    }
    }
     async create(order: IIdentfaibleOrderItem): Promise<id> {
        //since the order table is dependent on the item table so i need to create the tables of cake book toy first
        //transcation
        //insert into orders
        //insert into cakes
        let connection;
    try{
          connection=await ConnectionManager.getConnection();
          connection.query('BEGIN TRANSACTION;');
       
        const item_id=await this.itemRepo.create(order.getItem());
      
        await connection.query(INSERT_ORDER_QUERY,[
           order.getId(),
           order.getPrice(),
           order.getQuantity(),
           order.getItem().getCategory(),
           item_id
           
        ]);
        connection.query('COMMIT;');
           logger.info(`Order created with id ${order.getId()}`);
        return order.getId();
     
  
    }
    catch(error){
        logger.error(error);
        connection && connection.query('ROLLBACK;');
        throw new DBException('ERROR during creation',error as Error);
    }
    finally{
      if (connection) connection.release();   
    }
    }
     async get(id: id): Promise< IIdentfaibleOrderItem> {
      let connection;
        try{
            connection=await ConnectionManager.getConnection();
            const target= await connection.query<SQLOrder>(GET_ORDER_BY_ID_QUERY,[id]);
            const row=target.rows[0];
            if(!row){
                logger.error('order not found');
                throw new Error("order of id "+id+'is not found');


            }

            const item=    await this.itemRepo.get(row.item_id);
          return  new SQLORDERMAPPER().map({data:row,item:item});
            

      }
      catch(error){
        logger.error(error);
        throw new DBException('ERROR fetching the order of id   %o',error as Error);
    }
    finally{
           if (connection) connection.release();   
    }
}
  async getALL(): Promise<IIdentfaibleOrderItem[]> {
    let connection;
    try {
        connection = await ConnectionManager.getConnection();

        // 1. Load all items
        const items = await this.itemRepo.getALL();
        if (items.length === 0) return [];

        // 2. Load all orders for the category of the FIRST item
        //    If this is intentional, keep it. If not, tell me and we fix it.
        const category = items[0].getCategory();
        const result = await connection.query<SQLOrder>(GET_ORDERS, [category]);

        const orders = result.rows; // PostgreSQL rows
        
        // 3. Bind each order to the matching item
        const bound = orders.map(order => {
            const item = items.find(i => i.getId() === order.item_id);
            if (!item) {
                throw new DBException(`Item with id ${order.item_id} not found`,error as any);
            }
            return { order, item };
        });

        // 4. Map to domain objects
        const mapper = new SQLORDERMAPPER();
        return bound.map(({ order, item }) =>
            mapper.map({ data: order, item })
        );

    } catch (error) {
        logger.error(error);
        throw new DBException("error fetching all orders", error as Error);

    } finally {
        if (connection) connection.release();
    }
}


  async update(item: IIdentfaibleOrderItem): Promise<void> {
    let connection;

    try {
        connection = await ConnectionManager.getConnection();

        // BEGIN transaction
        await connection.query("BEGIN");

        // 1. Update the item (other repository)
        await this.itemRepo.update(item.getItem());

        // 2. Update the order
        await connection.query(UPDATE_ORDER, [
            item.getQuantity(),
            item.getPrice(),
            item.getItem().getCategory(),
            item.getItem().getId(),
            item.getId()
        ]);

        // COMMIT
        await connection.query("COMMIT");

        logger.info("Order update success");
    }
    catch (error) {
        logger.error(error);

        if (connection) {
            await connection.query("ROLLBACK");
        }

        throw new DBException("ERROR during update", error as Error);
    }
    finally {
        if (connection) connection.release();
    }
}

     async delete(id: id): Promise<void> {
    let connection;

    try {
        connection = await ConnectionManager.getConnection();

        // BEGIN transaction
        await connection.query("BEGIN");

        // 1. Delete item
        await this.itemRepo.delete(id);

        // 2. Delete order
        await connection.query(DELETE_ORDER_BY_ID, [id]);

        // COMMIT
        await connection.query("COMMIT");
    }
    catch (error) {
        logger.error(error);

        if (connection) {
            await connection.query("ROLLBACK");
        }

        throw new DBException("ERROR during deletion", error as Error);
    }
    finally {
        if (connection) connection.release();
    }
}

            }

    
