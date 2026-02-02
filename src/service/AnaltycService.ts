import { Order } from "models/order.model";
import { OrderManagement } from "./OrderMangmnet";
import { ItemCategory } from "../models/Iitem";
import { DBMode, RepositoryFactory } from "../repository/Repo.factory";

export class AnaltycService{
     constructor(private readonly orderManagement:OrderManagement){

    }
     public async getTotalRevenue():Promise<number>{
           const  orders=await this.orderManagement.getAll();
           const revenue=orders.map(order=>order.getPrice()*order.getQuantity());
           let  total=0;
           for(const rev of revenue){
            total+=rev;
             }
    
           return total;
        }
        public async getTotalOrders():Promise<number>{
            const orders=await this.orderManagement.getAll();
            return orders.length;
        }
   /* public async groupOrdersByCategory(): Promise<{
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
    }*/
   public async groupOrdersByCategory(): Promise<{
    totalOrders: number;
    byCategory: Record<ItemCategory, number>;
}> {
    // Get ALL orders once
    const allOrders = await this.orderManagement.getAll();
    
    const byCategory: Record<ItemCategory, number> = {
        [ItemCategory.Cake]: 0,
        [ItemCategory.Book]: 0,
        [ItemCategory.Toy]: 0,
    };
    
    // Count by actual category
    for (const order of allOrders) {
        const category = order.getItem().getCategory();
        byCategory[category]++;
    }
    
    const totalOrders = allOrders.length;
    
    return {
        totalOrders,
        byCategory
    };
}
    
    
   /* public async GenerateRevenueByCategory(): Promise<{
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
    }*/
   public async GenerateRevenueByCategory(): Promise<{
    byCategory: Record<ItemCategory, number>;
}> {
    const byCategory: Record<ItemCategory, number> = {
        [ItemCategory.Cake]: 0,
        [ItemCategory.Book]: 0,
        [ItemCategory.Toy]: 0,
    };

    // Get all orders once using your existing getAll() method
    const allOrders = await this.orderManagement.getAll();
    
    // Calculate revenue for each order and group by category
    for (const order of allOrders) {
        const category = order.getItem().getCategory();
        const revenue = order.getPrice() * order.getQuantity();
        byCategory[category] += revenue;
    }

    return {
        byCategory
    };
}
    
    
}