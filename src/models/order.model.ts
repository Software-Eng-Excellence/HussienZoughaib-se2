import { IItem } from "./Iitem"
import { IOrder } from "./Iorder"

export class Order implements IOrder {
    private id: string;
    private item: IItem;
    private quantity: number;
    private price: number;

    constructor(id: string, item: IItem, quantity: number = 1, price: number = 0) {
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