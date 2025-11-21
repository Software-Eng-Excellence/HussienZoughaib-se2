

import { IIdentfaibleItem, IItem, ItemCategory } from "./Iitem";
import { id } from "repository/IRepository";


export class IintToy implements  IIdentfaibleItem{
    constructor(private id:id,private toy:Toy){}
    getCategory(): ItemCategory {
        throw new Error("Method not implemented.");
    }
    getIitem(): IItem {
        return this.toy;   
    }
    getId(): id {
        return this.id;
    }
    
}

export class Toy implements IItem {
    private type: string;
    private ageGroup: number;
    private brand: string;
    private material: string;
    private batteriesRequired: boolean;
    private educational: boolean;

    constructor(
        type: string,
        ageGroup: number,
        brand: string,
        material: string,
        batteriesRequired: boolean,
        educational: boolean
    ) {
        this.type = type;
        this.ageGroup = ageGroup;
        this.brand = brand;
        this.material = material;
        this.batteriesRequired = batteriesRequired;
        this.educational = educational;
    }

    // Getters
    getType(): string {
        return this.type;
    }

    getAgeGroup(): number {
        return this.ageGroup;
    }

    getBrand(): string {
        return this.brand;
    }

    getMaterial(): string {
        return this.material;
    }

    isBatteriesRequired(): boolean {
        return this.batteriesRequired;
    }

    isEducational(): boolean {
        return this.educational;
    }

    // Category
    getCategory(): ItemCategory {
        return ItemCategory.Toy;
    }
}
