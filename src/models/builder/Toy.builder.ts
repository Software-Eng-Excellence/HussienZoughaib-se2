import logger from "../../util/logger";
import { IintToy, Toy } from "../Toy.model";
export class ToyBuilder {
      private type!: string;
    private ageGroup!: number;
    private brand!: string;
    private material!: string;
    private batteriesRequired!: boolean;
    private educational!: boolean;
    public static createBuilder(): ToyBuilder {
        return new ToyBuilder();
    }
    // Setters - return this for fluent builder usage
    setType(type: string): this {
        this.type = type;
        return this;
    }

    setAgeGroup(ageGroup: number): this {
        this.ageGroup = ageGroup;
        return this;
    }

    setBrand(brand: string): this {
        this.brand = brand;
        return this;
    }

    setMaterial(material: string): this {
        this.material = material;
        return this;
    }

    setBatteriesRequired(required: boolean): this {
        this.batteriesRequired = required;
        return this;
    }

    setEducational(educational: boolean): this {
        this.educational = educational;
        return this;
    }
    build(): Toy {
        const requiredFields = [
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteriesRequired,
            this.educational
        ];
        for (const field of requiredFields) {
            if (field === undefined || field === null) {
                throw new Error("Missing required field for Toy");
            }
        }
        return new Toy(
            this.type,
            this.ageGroup,
            this.brand,
            this.material,
            this.batteriesRequired,
            this.educational
        );
    }
}
export class IdentfToyBuilder{
    id!:string;
    toy!:Toy;
    static createBuilder():IdentfToyBuilder{
        return new IdentfToyBuilder();
    }
      setId(id:string):IdentfToyBuilder{
        this.id=id;
        return this;
    }
    setToy(toy:Toy):IdentfToyBuilder{
        this.toy=toy;
        return this;
    }
    build():IintToy{
        if(!this.id){
            logger.error("Missing id for IintToy");
            throw new Error("Missing id for IinToy");
        }
        if(!this.toy){
            logger.error("Missing Cake for IintCake");
            throw new Error("Missing Cake for IintCake");
        }
        return new IintToy(
            this.id,
            this.toy.getType(),
            this.toy.getAgeGroup(),
            this.toy.getBrand(),
            this.toy.getMaterial(),
            this.toy.isBatteriesRequired(),
            this.toy.isEducational()   
        );
    }


}