import { CakeBuilder } from "../models/builder/Cake.builder";
import { Cake } from "../models/Cake.model";
import { IMapper } from "./IMapper";



export class CSVCakeMapper implements IMapper<string[], Cake> {
    map(input: string[]): Cake {
         return CakeBuilder.createBuilder()
            .setType(input[1])
            .setFlavor(input[2])
            .setFilling(input[3])
            .setSize(parseInt(input[4]))
            .setLayer(parseInt(input[5]))
            .setFrostingType(input[6])
            .setFrostingFlavor(input[7])
            .setDecType(input[8])
            .setDecColor(input[9])
            .setCustomMessage(input[10])
            .setShape(input[11])
            .setAllergies(input[12])
            .setSpIng(input[13])
            .setPackageType(input[14])
            .build();
        
    }
}