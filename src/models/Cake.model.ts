import { id } from "repository/IRepository";
import { IIdentfaibleItem, IItem, ItemCategory } from "./Iitem";
//i made this class since the ireepo  interfcae needs to have T exteds ID and ai dont want to cahnge the intial code so i made init  cake whre it  implments identfaibleitem whuch extends ID and IItem id for get id and item to getcat and i put cake model inside the constructor


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
export class IintCake  extends Cake implements  IIdentfaibleItem{
    constructor(
        private id: id,
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
        super(
            type,
            flavor,
            filling,
            size,
            layer,
            frostingtype,
            frostingflavor,
            dectype,
            deccolor,
            custommessage,
            shape,
            allergies,
            spIng,
            paakageType
        );
    }
    
    getId(): id {
        return this.id;
    }
    
}