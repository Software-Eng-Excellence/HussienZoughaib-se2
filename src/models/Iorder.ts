import { ID } from "repository/IRepository";
import { IIdentfaibleItem, IItem } from "./Iitem"
export interface IOrder extends ID{
    getItem():IItem;
    getQuantity():number;
    getPrice():number;

}
export interface IIdentfaibleOrderItem extends IOrder,ID{
    getItem():IIdentfaibleItem;
}