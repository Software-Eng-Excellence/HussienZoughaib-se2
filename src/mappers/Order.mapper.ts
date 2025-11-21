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
