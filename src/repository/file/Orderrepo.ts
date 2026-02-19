import logger from "../../util/logger";

import { id, IRepository } from "../IRepository";
import { InvalidItemException, ItemNotFoundException } from "../../util/exceptions/RepoException";
import { IOrder } from "../../models/Iorder";

//since every order repo will have itsbown laod and save method i will make this class abstract and exyend itbim every type
export  abstract class Orderrepo implements IRepository<IOrder> {
     protected abstract load():Promise<IOrder[]>;
    
   protected abstract save(orders:IOrder[]):Promise<void>;
    
     async create(item: IOrder): Promise<id> {
        if(!item){
            logger.error("Invalid order item");
            throw new InvalidItemException("Invalid order item");
        }
        //load all orders
        const orders=await this.load();
        //add new order
         const id=orders.push(item);
        //save orders
        await this.save(orders);
        logger.info(`Order with id ${item.getId()} created successfully`);
        return String(id);
        
    }
     async get(id: string): Promise<IOrder> {
        const orders= await this.load();
        const order= orders.find(o=>o.getId()===id);
        if(!order){
            logger  .error(`Order with id ${id} not found`);
            throw new ItemNotFoundException(`Order with id ${id} not found`);
        }
        logger.info(`Order with id ${id} retrieved successfully`);
        return order;
    }
     async  getALL(): Promise<IOrder[]> {
        const orders=await this.load();
        if(!orders){
            logger.error("No orders found");
            throw new ItemNotFoundException("No orders found");
        }
        logger.info("All orders retrieved successfully");
        return orders;
    }
    async  update(item: IOrder): Promise<void> {
        if(!item){
            logger.error("Invalid order item");
            throw new InvalidItemException("Invalid order item");
        }
        const orders= await this.load();
        const index= orders.findIndex(o=>o.getId()===item.getId());
        if(index===-1){
            logger.error(`Order with id ${item.getId()} not found`);
            throw new ItemNotFoundException(`Order with id ${item.getId()} not found`);
        }
        orders[index]=item;
        await this.save(orders);
        logger.info(`Order with id ${item.getId()} updated successfully`);
    }
     async delete(id: id): Promise<void> {
        const orders=await this.load();
        const index= orders.findIndex(o=>o.getId()===id);
        if(index===-1){
            logger.error(`Order with id ${id} not found`);
            throw new ItemNotFoundException(`Order with id ${id} not found`);
        }
        orders.splice(index,1);
        await this.save(orders);
        logger.info(`Order with id ${id} deleted successfully`);
    }
    
}