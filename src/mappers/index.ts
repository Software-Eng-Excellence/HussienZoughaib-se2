import { ItemCategory } from "../models/Iitem";
import { JsonRequestOrderMapper } from "./Order.mapper";
import { JsonCakeMapper } from "./Cake.mapper";

export class JsonFactorry {
    public static createMapper(type: string): JsonRequestOrderMapper {
        switch(type) {
            case ItemCategory.Cake:
                return new JsonRequestOrderMapper(new JsonCakeMapper());
            case ItemCategory.Book:
            case ItemCategory.Toy:
                // Use CakeMapper as fallback, or create a generic mapper
                return new JsonRequestOrderMapper(new JsonCakeMapper());
            default:
                throw new Error("Unsupported category");
        }
    }
}