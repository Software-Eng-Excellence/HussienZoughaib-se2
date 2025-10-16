import logger from "../../util/logger";
import { Cake } from "../Cake.model";

export class CakeBuilder {
    private type!: string;
    private flavor!: string;
    private filling!: string;
    private size!: number;
    private layer!: number;
    private frostingType!: string;
    private frostingFlavor!: string;
    private decType!: string;
    private decColor!: string;
    private customMessage!: string;
    private shape!: string;
    private allergies!: string;
    private spIng!: string;
    private packageType!: string;
    public static createBuilder(): CakeBuilder {
        return new CakeBuilder();
    }

    setType(type: string): CakeBuilder {
        this.type = type;
        return this;
    }

    setFlavor(flavor: string): CakeBuilder {
        this.flavor = flavor;
        return this;
    }

    setFilling(filling: string): CakeBuilder {
        this.filling = filling;
        return this;
    }

    setSize(size: number): CakeBuilder {
        this.size = size;
        return this;
    }

    setLayer(layer: number): CakeBuilder {
        this.layer = layer;
        return this;
    }

    setFrostingType(frostingType: string): CakeBuilder {
        this.frostingType = frostingType;
        return this;
    }

    setFrostingFlavor(frostingFlavor: string): CakeBuilder {
        this.frostingFlavor = frostingFlavor;
        return this;
    }

    setDecType(decType: string): CakeBuilder {
        this.decType = decType;
        return this;
    }

    setDecColor(decColor: string): CakeBuilder {
        this.decColor = decColor;
        return this;
    }

    setCustomMessage(customMessage: string): CakeBuilder {
        this.customMessage = customMessage;
        return this;
    }

    setShape(shape: string): CakeBuilder {
        this.shape = shape;
        return this;
    }

    setAllergies(allergies: string): CakeBuilder {
        this.allergies = allergies;
        return this;
    }

    setSpIng(spIng: string): CakeBuilder {
        this.spIng = spIng; 
        return this;
    }

    setPackageType(packageType: string): CakeBuilder {
        this.packageType = packageType;
        return this;
    }

    build(): Cake {
        // ✅ Validate that all fields are provided
        const requiredFields = [
             this.type,
             this.flavor,
         this.filling,
             this.size,
             this.layer,
             this.frostingType,
             this.frostingFlavor,
         this.decType,
             this.decColor,
             this.customMessage,
             this.shape,
             this.allergies,
             this.spIng,
             this.packageType
        ];

        for(const property of requiredFields) {
            if(property === undefined || property === null) {
                logger.error("Missing required field for Cake");
                throw new Error("Missing required field for Cake");
            }
        }

        // ✅ If all good, create and return the Cake
        return new Cake(
            this.type,
            this.flavor,
            this.filling,
            this.size,
            this.layer,
            this.frostingType,
            this.frostingFlavor,
            this.decType,
            this.decColor,
            this.customMessage,
            this.shape,
            this.allergies,
            this.spIng,
            this.packageType
        );
    }
}
