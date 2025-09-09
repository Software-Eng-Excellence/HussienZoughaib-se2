import logger from "../util/logger";

export interface Order{
    id:number,
    item:string,
    price:number
}
 export class OrderManagment{
    //to add,fetchorder
    private orders:Order[]=[];
    constructor(private validater:IValidater,private Calculater:ICalculater){
          
    }
    getOrder(){
       return this.orders;
    }
    addOrder(item:string,price:number){
       // ValidateOtrder.CheckItems(item);
        //ValidateOtrder.CheckPrice(price);
        try{
               const order:Order={id:this.orders.length+1,item,price};
        this.validater.validate(order);
            this.orders.push(order);
        }
      catch(error){
        throw new Error(`Failed to add order: ${(error as Error).message}`);
      }


    }
    FetchOrder(fetchId:number){
        const order = this.getOrder().find(order => order.id === fetchId);
        if (!order) {
            logger.warn(`Order with ID ${fetchId} not found.`);
            
        }
        return order;
    }
    getRevenue(){
        return this.Calculater.Calculate_Revenue(this.getOrder());
    }
    getBuyPower(){
        return this.Calculater.Calculate_Buy_Power(this.getOrder());
    }
}
 export class PremuimOrderManagment extends OrderManagment{
    FetchOrder(fetchId: number): Order | undefined {
        console.log("This is from Premuim Order Managment");
         return super.FetchOrder(fetchId);
    }
}
interface IValidater{
    validate(orders:Order):void;
}
 export class ValidateOtrder implements IValidater{
    private rules:IValidater[]=[
        new PriceValidater(),
        new ItemValidater(),
        new MaxPriceValidater()
    ]
   
     validate(orders: Order): void {
        for (const rule of this.rules) {
            rule.validate(orders);
        }
     }
     
    
}


 export class MaxPriceValidater implements IValidater{
    validate(orders:Order){
        if(orders.price>100){
            throw new Error('price must be less than 100');
        }
    }
}
 export class PriceValidater implements IValidater{
    validate(orders:Order){
        if(orders.price<=0){
            logger.error("Price must be greater than zero");
              throw new Error("Price must be greater than zero");
        }
    }
}
export  class ItemValidater implements IValidater {
    private validItems = [
        "Sponge",
        "Chocolate",
        "Fruit",
        "Red Velvet",
        "Birthday",
        "Carrot",
        "Marble",
        "Coffee",
    ];

    validate(order: Order) {
        if (!this.validItems.includes(order.item)) {
            logger.error(`Invalid item '${order.item}'. Must be one of: ${this.validItems.join(", ")}`);
            throw new Error(`Invalid item '${order.item}'. Must be one of: ${this.validItems.join(", ")}`);
        }
    }
}
interface ICalculater{
    Calculate_Revenue(orders:Order[]):number;
    Calculate_Buy_Power(orders:Order[]):number;
}
 export class FinanceCalculater implements ICalculater{
      
  public    Calculate_Revenue(orders:Order[]):number{
        return  orders.reduce((total, order) => total + order.price, 0);
     }
      public  Calculate_Buy_Power(orders:Order[]):number{
        return  orders.length === 0 ? 0 : this.Calculate_Revenue(orders) / orders.length;
     }

}