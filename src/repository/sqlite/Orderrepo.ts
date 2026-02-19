import { IIdentfaibleItem, ItemCategory } from "models/Iitem";
import { IIdentfaibleOrderItem, IOrder } from "models/Iorder";

import { id, Intiazable, IRepository } from "repository/IRepository";

import { DBException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import logger from "../../util/logger";
import { ConnectionManager } from "./ConnectionManger";
import { SQLOrder, SQLORDERMAPPER } from "../../mappers/Order.mapper";
import { error } from "winston";

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

const Insert_ORDER_QUERY = `
    INSERT INTO orders (id,price,quantity,item_category,item_id)
    VALUES (?,?,?,?,?);
    `;
const GET_ORDER_BY_ID_QUERY=`
    SELECT * FROM orders WHERE id=?;
`;
const GET_ORDERS='SELECT * FROM orders where  item_category =? ;';
// ...existing code...
const DELETE_ORDER_BY_ID = `DELETE FROM orders WHERE id = ?;`;
// ...existing code...
const UPDATE_ORDER= `
UPDATE orders
SET
quantity=?,price=?,item_category=?,item_id=? WHERE id=?;

`;
//3 this is why i implented intiazable to make sure init is there
export class Orderrepo implements IRepository<IIdentfaibleOrderItem>, Intiazable {
  
    constructor(private readonly itemRepo: IRepository<IIdentfaibleItem> & Intiazable){
    

        
      

    }
    //2 open the connection and make sure tabke exists and init is in the interface intiazable
    async init(){
        try{
         const connection= await ConnectionManager.getConnection();
       await  connection.exec( CREATE_TABLE_QUERY);
       await this.itemRepo.init();
       logger.info("Orders table ensured in the database");
    }
    catch(error:unknown){
        logger.error("Failed to initialize the repository", error as Error);
        throw new  RepositoryInitializationException("Failed to initialize the repository", error as Error);
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
          connection.exec('BEGIN TRANSACTION;');
       
        const item_id=await this.itemRepo.create(order.getItem());
      
        await connection.run(Insert_ORDER_QUERY,[
           order.getId(),
           order.getPrice(),
           order.getQuantity(),
           order.getItem().getCategory(),
           item_id
           
        ]);
        connection.exec('COMMIT;');
           logger.info(`Order created with id ${order.getId()}`);
        return order.getId();
     
  
    }
    catch(error){
        logger.error(error);
        connection && connection.exec('ROLLBACK;');
        throw new DBException('ERROR during creation',error as Error);
    }
    }
     async get(id: id): Promise< IIdentfaibleOrderItem> {
      let connection;
        try{
            connection=await ConnectionManager.getConnection();
            const target= await connection.get<SQLOrder>(GET_ORDER_BY_ID_QUERY,id);
            if(!target){
                logger.error('order not found');
                throw new Error("order of id "+id+'is not found');


            }

            const item=    await this.itemRepo.get(target.item_id);
          return  new SQLORDERMAPPER().map({data:target,item:item});
            

      }
      catch(error){
        logger.error(error);
        throw new DBException('ERROR fetching the order of id   %o',error as Error);
    }
}
    async getALL(): Promise< IIdentfaibleOrderItem[]> {
        let connection;
        try{
            connection=await ConnectionManager.getConnection();

            const items=await this.itemRepo.getALL();
            if(items.length==0){
                return [];
            }
            const orders=await connection.all<SQLOrder[]>(GET_ORDERS,items[0].getCategory());
            //bind order to items
            const BindedOrders=orders.map((order)=>{
                const item=items.find((item)=>item.getId()==order.item_id);
                if(!item){
                    throw new DBException('error',error as any);

                }

                return {order,item}

            })
            const mapper=new SQLORDERMAPPER();
            const reuslt=BindedOrders.map(({order,item})=>{
                 return mapper.map({data:order,item})
            })
            return reuslt;
        }
        catch(error){
            logger.error(error);
            throw new DBException('error fetching all orders %o',error as Error);
        }
    }
     async update(item: IIdentfaibleOrderItem): Promise<void> {
        let connection;
    try{
        connection=await ConnectionManager.getConnection();
          connection.exec('BEGIN TRANSACTION;');
          await this.itemRepo.update(item.getItem());
          await connection.run(UPDATE_ORDER,[
           item.getQuantity(),
           item.getPrice(),
           item.getItem().getCategory(),
           item.getItem().getId(),
           item.getId()


          ])

              connection.exec('COMMIT;');
              logger.info('update suces');
          

    }
    catch(error){
      logger.error(error);
        connection && connection.exec('ROLLBACK;');
        throw new DBException('ERROR during update',error as Error);
        
    }
    }
     async delete(id: id): Promise<void> {
        let connection
        try{
            connection= await ConnectionManager.getConnection();

              connection.exec('BEGIN TRANSACTION;');
              const item_id=(await this.get(id)).getItem().getId();
              await this.itemRepo.delete(item_id);
              await connection.run(DELETE_ORDER_BY_ID,id);
               connection.exec('COMMIT;');

       }
        catch(error){
            logger.error(error);
               connection && connection.exec('ROLLBACK;');
        throw new DBException('ERROR during creation',error as Error);
            
        }
             }
            }

    
