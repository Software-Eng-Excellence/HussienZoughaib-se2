import { IintToy, Toy } from "models/Toy.model";
import { IMapper } from "./IMapper";
import { IdentfToyBuilder, ToyBuilder } from "../models/builder/Toy.builder";

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
export interface SqlToy{
    id:string,
     type: string;
     ageGroup: number;
     brand: string;
     material: string;
     batteriesRequired: boolean;
     educational: boolean;
}
export class SQLTOYMAPPER implements IMapper<SqlToy,IintToy>{
    map(input: SqlToy): IintToy {
        return IdentfToyBuilder.createBuilder().setToy(
            ToyBuilder.createBuilder().setType(input.type).setAgeGroup(input.ageGroup).
            setBrand(input.brand).setMaterial(input.material).setBatteriesRequired(input.batteriesRequired)
            .setEducational(input.educational).build()
        ).setId(input.id).build();
    }
    reversemap(input: IintToy): SqlToy {
        throw new Error("Method not implemented.");
    }

}