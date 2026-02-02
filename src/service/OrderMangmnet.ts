import { DBMode, RepositoryFactory } from "../repository/Repo.factory";

import { ServiceException } from "../util/exceptions/ServiceException";



import { IIdentfaibleOrderItem } from "../models/Iorder";
import { ItemCategory } from "../models/Iitem";

import { NotFoundException } from "../util/exceptions/http/NotFoundException";
import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class OrderManagement {
    //create
    public  async create(order:IIdentfaibleOrderItem):Promise<IIdentfaibleOrderItem>{
        //validate order
        this.validateOrder(order);
   
        //persist the order to the database'
       const repo=await this.getRepositoryByCategory(order.getItem().getCategory());
        await repo.create(order);
       return order;

        

    
    }
    //get 
    public async get(id:string):Promise<IIdentfaibleOrderItem>{
        const catigories=Object.values(ItemCategory)
        for(const cat of catigories){
            try{
            const repo=await RepositoryFactory.create(DBMode.SQLITE,cat);
            const order=await repo.get(id);
            if(order){
                return order;
            }
        }catch(err){
        }
        }
        throw new NotFoundException("Order not found");
        
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
        throw new NotFoundException("Order not found");
    }
    //get all orders
   /* public async getAll():Promise<IIdentfaibleOrderItem[]>{
        const allOrders:IIdentfaibleOrderItem[]=[];
        const catigories=Object.values(ItemCategory)
        console.log("Categories:", catigories);
        for(const cat of catigories){
            const repo=await RepositoryFactory.create(DBMode.SQLITE,cat);
            const orders=await repo.getALL();
            allOrders.push(...orders);
        }
        console.log("All Orders:", allOrders);
        return allOrders;
    }*/

   
public async getAll(): Promise<IIdentfaibleOrderItem[]> {
  const allOrders: IIdentfaibleOrderItem[] = [];
  const categories = Object.values(ItemCategory);
  console.log("Categories:", categories);
  
  for (const cat of categories) {
    // TEMPORARY FIX: Only process cake for now
    if (cat !== ItemCategory.Cake) {
      console.log(`Skipping ${cat} - repository not implemented yet`);
      continue; // Skip other categories
    }
    
    const repo = await RepositoryFactory.create(DBMode.SQLITE, cat);
    const orders = await repo.getALL();
    allOrders.push(...orders);
  }
  
  console.log("All Orders:", allOrders);
  return allOrders;
}
   





    
    private validateOrder(order:IIdentfaibleOrderItem):void{
      if (!order.getItem() || order.getPrice() <= 0 || order.getQuantity() <= 0) {
        const details = {
            ItemNotDefined: !order.getItem(),
            PriceNegative: order.getPrice() <= 0,
            QuantityNegative: order.getQuantity() <= 0
        }
        throw new BadRequestException("Invalid order: item, price, and quantity must be valid.", details);
    }
    }
    private async getRepositoryByCategory(category:ItemCategory){
        return RepositoryFactory.create(DBMode.SQLITE,category);
    }
}