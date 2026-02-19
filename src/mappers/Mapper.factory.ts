import { IIdentfaibleItem, ItemCategory } from "../models/Iitem";
import { IMapper } from "./IMapper";

import { CSVCakeMapper, SQLITCAKEMAPPER } from "./Cake.mapper";
import { BookMapper, SQLBOOKMAPPER } from "./Book.mapper";
import { SQLTOYMAPPER, ToyMapper } from "./Toy.mapper";

export enum MapperType{
    SQL,
    FILE
}
export class MapperFactory{
    public static async create(type:MapperType,catigory:ItemCategory):Promise<IMapper<any,any>>{
       
            switch(type){
                case MapperType.SQL:{
                   
                    switch(catigory){
                        case ItemCategory.Cake:
                            return new SQLITCAKEMAPPER();
                            break;
                        case ItemCategory.Book:
                            return new  SQLBOOKMAPPER();
                            break;
                        case ItemCategory.Toy:
                            return new  SQLTOYMAPPER();
                            break;


                        default:
                            throw new Error("Unsupported category for SQL mapper");
                    
                    }
                }
                case MapperType.FILE:{
                    switch(catigory){
                        case ItemCategory.Cake:
                            return new CSVCakeMapper();
                            break;
                        case ItemCategory.Book:
                            return new BookMapper();
                            break;
                        case ItemCategory.Toy:
                            return new  ToyMapper();
                            break;
                        default:
                            throw new Error("Unsupported category for FILE mapper");
                }
           
            }
        }

            
        
       

    }
    }
