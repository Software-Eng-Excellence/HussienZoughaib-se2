import { id } from "repository/IRepository";
import { IIdentfaibleItem, IItem } from "./Iitem"
import { IIdentfaibleOrderItem, IOrder } from "./Iorder"

export class Order implements IOrder {
    private id: string;
    private item: IItem;
    private quantity: number;
    private price: number;

    constructor(id: string, item: IItem, quantity: number , price: number ) {
        this.id = id;
        this.item = item;
        this.quantity = quantity;
        this.price = price;
    }

    getItem(): IItem {
        return this.item;
    }
    getQuantity(): number {
        return this.quantity;
    }
    getPrice(): number {
        return this.price;
    }
    getId(): string {
        return this.id;
    }
}
export class InitOrder  implements IIdentfaibleOrderItem {
   constructor(private id:string, private identitem:IIdentfaibleItem,  private quantity:number,  private price:number){
    
   }
   
    getQuantity(): number {
      return this.quantity;
    }
    getPrice(): number {
        return this.price;
    }
    getId(): id {
     return this.id;
    }
    getItem(): IIdentfaibleItem  {
        return this.identitem;
      
    }
}