import { DBMode, RepositoryFactory } from "../repository/Repo.factory";

import { ServiceException } from "../util/exceptions/ServiceException";



import { IIdentfaibleOrderItem } from "../models/Iorder";
import { ItemCategory } from "../models/Iitem";

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
public async groupOrdersByCategory(): Promise<{
    totalOrders: number;
    byCategory: Record<ItemCategory, number>;
}> {
    const byCategory: Record<ItemCategory, number> = {
        [ItemCategory.Cake]: 0,
        [ItemCategory.Book]: 0,
        [ItemCategory.Toy]: 0,
    };

    let totalOrders = 0;

    const categories = Object.values(ItemCategory);

    for (const category of categories) {
        const repo = await RepositoryFactory.create(DBMode.SQLITE, category);

        // get total per category using the repo logic
        const count = await repo.getALL();

        byCategory[category] = count.length;
        totalOrders += count.length;
    }

    return {
        totalOrders,
        byCategory
    };
}


public async GenerateRevenueByCategory(): Promise<{
    byCategory: Record<ItemCategory, number>;
}> {
    const byCategory: Record<ItemCategory, number> = {
        [ItemCategory.Cake]: 0,
        [ItemCategory.Book]: 0,
        [ItemCategory.Toy]: 0,
    };

    const categories = Object.values(ItemCategory);
    
    for (const category of categories) {
        const repo = await RepositoryFactory.create(DBMode.SQLITE, category);
        // Get orders for this specific category from the repository
        const orders = await repo.getALL();
        
        // Calculate revenue for this specific category
        let revenuePerCategory = 0;
        for (const order of orders) {
            revenuePerCategory += order.getPrice() * order.getQuantity();
        }
        
        byCategory[category] = revenuePerCategory;
    }

    return {
        byCategory
    };
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