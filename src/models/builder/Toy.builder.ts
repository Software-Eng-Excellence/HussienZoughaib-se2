import { Toy } from "../Toy.model";
export class ToyBuilder {
      private type!: string;
    private ageGroup!: number;
    private brand!: string;
    private material!: string;
    private batteriesRequired!: boolean;
    private educational!: boolean;

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
