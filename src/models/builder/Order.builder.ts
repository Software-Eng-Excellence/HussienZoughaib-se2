import { IIdentfaibleOrderItem } from "models/Iorder";
import { IIdentfaibleItem, IItem } from "../Iitem";
import { InitOrder, Order } from "../order.model";

export class OrderBuilder {
        private id!: string;
        private item!: IItem;
        private quantity!: number;
        private price!: number;
    public static createBuilder(): OrderBuilder {
        return new OrderBuilder();
    }        
        // Set the order id
        setId(id: string): this {
            this.id = id;
            return this;
        }

        // Set the item (IItem)
        setItem(item: IItem): this {
            this.item = item;
            return this;
        }

        // Set the quantity
        setQuantity(quantity: number): this {
            this.quantity = quantity;
            return this;
        }

        // Set the price
        setPrice(price: number): this {
            this.price = price;
            return this;
        }

        // Build and return an Order instance
        build(): Order {
            const required=[this.id,this.item,this.quantity,this.price];
            for (const field of required) {
                if (field === undefined) {
                    throw new Error("Missing required fields to build Order");
                }
            }
            return new Order(this.id, this.item, this.quantity, this.price);

          
        }
}
export class IdentfOrderBuilder{
       private item!: IIdentfaibleItem;
      private order!:Order
    static createBuilder():IdentfOrderBuilder{
        return new IdentfOrderBuilder();
    }
    setItem(item:IIdentfaibleItem):IdentfOrderBuilder{  
        this.item=item;
        return this;
    }

        // Set the item (IItem)
        setOrder(order: Order): IdentfOrderBuilder {
            this.order = order;
            return this;
        }
              
          build():InitOrder{
       
        if(!this.item || !this.order){
            throw new Error("Missing required fields to build IdentfOrder");
        }
       
            return new InitOrder(this.order.getId(),this.item,this.order.getQuantity(),this.order.getPrice());
    }

    }
  
