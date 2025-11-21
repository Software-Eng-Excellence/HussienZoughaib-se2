import { ID } from "repository/IRepository";

 export interface IItem{
    getCategory():ItemCategory
}
 export enum ItemCategory{
    Cake='cake',
    Book='book',
    Toy='toy'
}
export interface IIdentfaibleItem extends IItem,ID{

    
}