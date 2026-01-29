import { IMapper } from "./IMapper";
import { IdentfOrderBuilder, OrderBuilder } from "../models/builder/Order.builder";
import { IIdentfaibleOrderItem, IOrder } from "../models/Iorder"; // adjust path if your Order class is located elsewhere
import { IIdentfaibleItem, IItem } from "models/Iitem";
import { InitOrder } from "models/order.model";




export class CSVOrderMapper implements IMapper<string[], IOrder> {
        constructor(private itemMapper: IMapper<string[], IItem>) {

        }
    map(input: string[]): IOrder {
    
        const item=this.itemMapper.map(input);
        return OrderBuilder.createBuilder()
            .setId(input[0])
            .setItem(item) // ensure shape matches IItem
            .setQuantity(parseInt(input[input.length-1]))
            .setPrice(parseInt(input[input.length-2]))
            .build();
    }
    reversemap(input: IOrder): string[] {
        const itemData=this.itemMapper.reversemap(input.getItem());
        return [
            
            input.getId(),
            ...itemData,
            input.getPrice().toString(),
            input.getQuantity().toString()
        ];
    }
}
export interface SQLOrder{
    id:string,
    price:number,
    quantity:number,
    item_category:string,
    item_id:string
}
export class SQLORDERMAPPER implements IMapper<{ data: SQLOrder; item: IIdentfaibleItem }, InitOrder>
{
    map(input: { data: SQLOrder; item: IIdentfaibleItem }): InitOrder {

        const { data, item } = input;

        // Build normal Order first
        const order = OrderBuilder
            .createBuilder()
            .setId(data.id)
            .setPrice(data.price)
            .setQuantity(data.quantity)
            .setItem(item)
            .build();

        // Build identifiable order (order + item)
        return IdentfOrderBuilder
            .createBuilder()
            .setOrder(order)
            .setItem(item)
            .build();
    }

    reversemap(input: InitOrder): { data: SQLOrder; item: IIdentfaibleItem } {
        return {
            data:{
            id: input.getId(),
            price: input.getPrice(),
            quantity: input.getQuantity(),
            item_category:input.getItem().getCategory(),
            item_id:input.getItem().getId()
            },
            item:input.getItem()
        };
    }
}
export interface JsonItem {
id: string;
}

export interface JsonOrder {
    id: string;
    catigory: string;
    item: IIdentfaibleItem;
    quantity: number;
    price: number;
}
export class JsonRequestOrderMapper implements IMapper<any,IIdentfaibleOrderItem>{
    constructor(private itemMapper:IMapper<any,IIdentfaibleItem>){

    }
    map(input: any): IIdentfaibleOrderItem {
        //extratct and item and build and identfibale ite,
        const item=this.itemMapper.map(input.item);
        //build an order
        const order=OrderBuilder.createBuilder()
            .setId(input.id)
            .setPrice(input.price)
            .setQuantity(input.quantity)
            .setItem(item)
            .build();

        //return identfiable order item
    return IdentfOrderBuilder.createBuilder()
        .setOrder(order)
        .setItem(item)
        .build();
  
    }
    reversemap(input: IIdentfaibleOrderItem) {
        return{
            category:input.getItem().getCategory(),
            ...input
        }
    }

}