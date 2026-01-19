import { IIdentfaibleOrderItem, IOrder } from "../models/Iorder";
import { IRepository } from "./IRepository";
import { ItemCategory } from "../models/Iitem";
import { Intiazable } from "./IRepository";
import { Orderrepo } from "./sqlite/Orderrepo";
import { CakeOrderRepo } from "./sqlite/CakeOrder.Repo";
import config from "../config";
import { CakeOrderRep } from "./file/CakeOrder.Rep";
import { Orderrep } from "./Postgr sql/Order.Repo";
import { CakeOrderRepp } from "./Postgr sql/CakeOrder.Repo";
import { BookRep } from "./Postgr sql/Book.Repo";
import { ToyOrderRepo } from "./Postgr sql/ToyOrder.Repo";

// repository/RepositoryFactory.ts
export enum DBMode {
    SQLITE,
    FILE,
    PostgrSQL
}

export class RepositoryFactory {

    public static async create(mode : DBMode, category: ItemCategory): Promise<IRepository<IIdentfaibleOrderItem>> {
        switch (mode) {
            case DBMode.SQLITE: {
                let repository: IRepository<IIdentfaibleOrderItem> & Intiazable;
                switch (category) {
                    case ItemCategory.Cake:
                        repository = new Orderrepo(new CakeOrderRepo());
                        break;
                    case ItemCategory.Book:
                        repository = new Orderrepo(new CakeOrderRepo());

                        break;
                    case ItemCategory.Toy:
                        repository = new Orderrepo(new CakeOrderRepo());
                        break;
                        default:
                            throw new Error("Unsupported category");
                    }
                await repository.init();
                return repository;
            }
            case DBMode.PostgrSQL:{
                let repository: IRepository<IIdentfaibleOrderItem> & Intiazable;
                switch (category) {
                    case ItemCategory.Cake:
                        repository = new Orderrep(new CakeOrderRepp());
                        break;
                    case ItemCategory.Book:
                        repository = new Orderrep(new BookRep());
                        break;
                    case ItemCategory.Toy:
                        repository = new Orderrep(new ToyOrderRepo());
                        break;
                        default:
                            throw new Error("Unsupported category");
                    }
                await repository.init();
                return repository;

            }

            //you make it clear that file repo is manzu3 and fix later 
            case DBMode.FILE:
                switch (category) {
                   
                    default:
                        throw new Error("Unsupported category");
                }
            default:
                throw new Error("Unsupported DB mode");
        } 

    }
}