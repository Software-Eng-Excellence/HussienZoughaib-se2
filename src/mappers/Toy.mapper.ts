import { Toy } from "models/Toy.model";
import { IMapper } from "./IMapper";
import { ToyBuilder } from "../models/builder/Toy.builder";

export class ToyMapper implements IMapper<string[], Toy> {
    map(input: string[]): Toy {
        return  ToyBuilder.createBuilder()
            .setType(input[1])
            .setAgeGroup(parseInt(input[2]))
            .setBrand(input[3])
            .setMaterial(input[4])
            .setBatteriesRequired(input[5].toLowerCase() === 'true')
            .setEducational(input[6].toLowerCase() === 'true')
            .build();
    }
    reversemap(input: Toy): string[] {
        return [
            input.getType(),
            input.getAgeGroup().toString(),
            input.getBrand(),
            input.getMaterial(),
            input.isBatteriesRequired().toString(),
            input.isEducational().toString()
        ];
    }


}