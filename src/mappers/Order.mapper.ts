import { IMapper } from "./IMapper";
import { OrderBuilder } from "../models/builder/Order.builder";
import { IOrder } from "../models/Iorder"; // adjust path if your Order class is located elsewhere
import { IItem } from "models/Iitem";


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
}
