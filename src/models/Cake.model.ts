import { IItem, ItemCategory } from "./Iitem";

 export class Cake implements IItem {
    private type: string;
    private flavor: string;
    private filling: string;
    private size: number;
    private layer: number;
    private frostingtype: string;
    private frostingflavor: string;
    private dectype: string;
    private deccolor: string;
    private custommessage: string;
    private shape: string;
    private allergies: string;
    private spIng: string;
    private paakageType: string;

    // ✅ Constructor to initialize all fields
    constructor(
        type: string,
        flavor: string,
        filling: string,
        size: number,
        layer: number,
        frostingtype: string,
        frostingflavor: string,
        dectype: string,
        deccolor: string,
        custommessage: string,
        shape: string,
        allergies: string,
        spIng: string,
        paakageType: string
    ) {
        this.type = type;
        this.flavor = flavor;
        this.filling = filling;
        this.size = size;
        this.layer = layer;
        this.frostingtype = frostingtype;
        this.frostingflavor = frostingflavor;
        this.dectype = dectype;
        this.deccolor = deccolor;
        this.custommessage = custommessage;
        this.shape = shape;
        this.allergies = allergies;
        this.spIng = spIng;
        this.paakageType = paakageType;
    }

    // ✅ Implement method from Item interface
    getCategory(): ItemCategory {
        return ItemCategory.Cake;
    }

    // ✅ Getters
    getType(): string {
        return this.type;
    }

    getFlavor(): string {
        return this.flavor;
    }

    getFilling(): string {
        return this.filling;
    }

    getSize(): number {
        return this.size;
    }

    getLayer(): number {
        return this.layer;
    }

    getFrostingType(): string {
        return this.frostingtype;
    }

    getFrostingFlavor(): string {
        return this.frostingflavor;
    }

    getDecType(): string {
        return this.dectype;
    }

    getDecColor(): string {
        return this.deccolor;
    }

    getCustomMessage(): string {
        return this.custommessage;
    }

    getShape(): string {
        return this.shape;
    }

    getAllergies(): string {
        return this.allergies;
    }

    getSpecialIngredients(): string {
        return this.spIng;
    }

    getPackageType(): string {
        return this.paakageType;
    }
}
