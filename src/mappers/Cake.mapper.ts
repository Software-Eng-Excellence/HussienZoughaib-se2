import { CakeBuilder, IndentCakeBuilder } from "../models/builder/Cake.builder";
import { Cake, IintCake } from "../models/Cake.model";
import { IMapper } from "./IMapper";



export class CSVCakeMapper implements IMapper<string[], Cake> {
    reversemap(input: Cake): string[] {
        return [
            
            input.getType(),
            input.getFlavor(),
            input.getFilling(),
            input.getSize().toString(),
            input.getLayer().toString(),
            input.getFrostingType(),
            input.getFrostingFlavor(),
            input.getDecType(),
            input.getDecColor(),
            input.getCustomMessage(),
            input.getShape(),
            input.getAllergies(),
            input.getSpecialIngredients(),
            input.getPackageType()
        ];
    }
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
export interface SqlCake{
      id: string;
    type: string;
    flavor: string;
    filling: string;
    size: number;
    layers: number;
    frosting_type: string;
    frosting_flavor: string;
    decoration_type: string;
    decoration_color: string;
    custom_message: string;
    shape: string;
    allergies: string;
    special_ingredients: string;
    package_type: string;
}
export class SQLITCAKEMAPPER implements IMapper<SqlCake,IintCake>{
    map(input: SqlCake): IintCake {
        return IndentCakeBuilder.createBuilder().setCake(CakeBuilder.createBuilder().
        setType(input.type).
        setFlavor(input.flavor).
        setFilling(input.filling)
        .setSize(input.size)
        .setLayer(input.layers)
        .setFrostingType(input.frosting_type)
        .setFrostingFlavor(input.frosting_flavor)
        .setDecType(input.decoration_type)
        .setDecColor(input.decoration_color)
        .setCustomMessage(input.custom_message)
        .setShape(input.shape)
        .setAllergies(input.allergies)

        .setSpIng(input.special_ingredients)
        .setPackageType(input.package_type)
        .build()
        ).setId(input.id)
        .build();
    
    }
   reversemap(input: IintCake): SqlCake {
    return {
        id: input.getId(),
        type: input.getType(),
        flavor: input.getFlavor(),
        filling: input.getFilling(),
        size: input.getSize(),
        layers: input.getLayer(),
        frosting_type: input.getFrostingType(),
        frosting_flavor: input.getFrostingFlavor(),
        decoration_type: input.getDecType(),
        decoration_color: input.getDecColor(),
        custom_message: input.getCustomMessage(),
        shape: input.getShape(),
        allergies: input.getAllergies(),
        special_ingredients: input.getSpecialIngredients(),
        package_type: input.getPackageType()
    };
}

    }


export class JsonCakeMapper implements IMapper<any, IintCake> {
    
    map(input: any): IintCake {
        const cake=CakeBuilder.createBuilder()
            .setType(input.type)
            .setFlavor(input.flavor)
            .setFilling(input.filling)
            .setSize(input.size)
            .setLayer(input.layers)
            .setFrostingType(input.frosting_type)
            .setFrostingFlavor(input.frosting_flavor)
            .setDecType(input.decoration_type)
            .setDecColor(input.decoration_color)
            .setCustomMessage(input.custom_message)
            .setShape(input.shape)
            .setAllergies(input.allergies)
            .setSpIng(input.special_ingredients)
            .setPackageType(input.package_type)
            .build();
        return IndentCakeBuilder.createBuilder()
            .setId(input.id)
            .setCake(cake)
            .build();

    }
    reversemap(input: IintCake) :any{
        return {
            id: input.getId(),
            type: input.getType(),
            flavor: input.getFlavor(),
            filling: input.getFilling(),
            size: input.getSize(),
            layers: input.getLayer(),
            frosting_type: input.getFrostingType(),
            frosting_flavor: input.getFrostingFlavor(),
            decoration_type: input.getDecType(),
            decoration_color: input.getDecColor(),
            custom_message: input.getCustomMessage(),
            shape: input.getShape(),
            allergies: input.getAllergies(),
            special_ingredients: input.getSpecialIngredients(),
            package_type: input.getPackageType()
        };
        };
    
    }

    