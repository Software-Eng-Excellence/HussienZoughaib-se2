import { IOrder } from "../models/Iorder";
import { IRepository } from "./IRepository";
import { ItemCategory } from "../models/Iitem";
import { Intiazable } from "./IRepository";
import { Orderrepo } from "./sqlite/Orderrepo";
import { CakeOrderRepo } from "./sqlite/CakeOrder.Repo";
import config from "../config";
import { CakeOrderRep } from "./file/CakeOrder.Rep";

// repository/RepositoryFactory.ts
export enum DBMode {
    SQLITE,
    FILE
}

export class RepositoryFactory {

    public static async create(mode : DBMode, category: ItemCategory): Promise<IRepository<IOrder>> {
        switch (mode) {
            case DBMode.SQLITE: {
                let repository: IRepository<IOrder> & Intiazable;
                switch (category) {
                    case ItemCategory.Cake:
                        repository = new Orderrepo(new CakeOrderRepo());
                        break;
                        default:
                            throw new Error("Unsupported category");
                    }
                await repository.init();
                return repository;
            }
            case DBMode.FILE:
                switch (category) {
                    case ItemCategory.Cake:
                        return new CakeOrderRep(config.Storage.CSV.cake);
                    default:
                        throw new Error("Unsupported category");
                }
            default:
                throw new Error("Unsupported DB mode");
        } 

    }
}