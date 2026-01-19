import { DBMode, RepositoryFactory } from "repository/Repo.factory";

import { ServiceException } from "../util/exceptions/ServiceException";



import { IIdentfaibleOrderItem } from "models/Iorder";
import { ItemCategory } from "models/Iitem";

export class OrderManagement {
    //create
    public  async create(order:IIdentfaibleOrderItem):Promise<IIdentfaibleOrderItem>{
        //validate order
        this.validateOrder(order);
   
        //persist the order to the database'
       const repo=await this.getRepositoryByCategory(order.getItem().getCategory());
       repo.create(order);
       return order;

        

    
    }
    //get 
    public async get(id:string):Promise<IIdentfaibleOrderItem>{
        const catigories=Object.values(ItemCategory)
        for(const cat of catigories){
            const repo=await RepositoryFactory.create(DBMode.SQLITE,cat);
            const order=await repo.get(id);
            if(order){
                return order;
            }
        }
        throw new ServiceException("Order not found");
        
    }
    
    //update
    public async update(order:IIdentfaibleOrderItem):Promise<void>{
        //validate order
        this.validateOrder(order);
        //persist the order to the database'
         const repo=await this.getRepositoryByCategory(order.getItem().getCategory());
            await repo.update(order);
          
    }
   //delete
    public async delete(id:string):Promise<void>{
        const catigories=Object.values(ItemCategory)
        for(const cat of catigories){
            const repo=await RepositoryFactory.create(DBMode.SQLITE,cat);
            const order=await repo.get(id);
            if(order){
                await repo.delete(id);
                return;
            }
        }
        throw new ServiceException("Order not found");
    }
    //get all orders
    public async getAll():Promise<IIdentfaibleOrderItem[]>{
        const allOrders:IIdentfaibleOrderItem[]=[];
        const catigories=Object.values(ItemCategory)
        for(const cat of catigories){
            const repo=await RepositoryFactory.create(DBMode.SQLITE,cat);
            const orders=await repo.getALL();
            allOrders.push(...orders);
        }
        return allOrders;
    }

    public async getTotalRevenue():Promise<number>{
       const  orders=await this.getAll();
       const revenue=orders.map(order=>order.getPrice()*order.getQuantity());
       let  total=0;
       for(const rev of revenue){
        total+=rev;
         }

       return total;
    }
    public async getTotalOrders():Promise<number>{
        const orders=await this.getAll();
        return orders.length;
    }
    private validateOrder(order:IIdentfaibleOrderItem):void{
        if(!order.getItem() || order.getQuantity() <= 0 || order.getPrice() <= 0){
            throw new ServiceException("Invalid order data");
        }
    }
    private async getRepositoryByCategory(category:ItemCategory){
        return RepositoryFactory.create(DBMode.SQLITE,category);
    }
}