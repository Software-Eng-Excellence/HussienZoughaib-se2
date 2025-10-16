import { IItem } from "./Iitem"
export interface IOrder{
    getItem():IItem;
    getQuantity():number;
    getPrice():number;
    getId():string;
}