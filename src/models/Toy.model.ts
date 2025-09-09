

import { IItem, ItemCategory } from "./Iitem";

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
