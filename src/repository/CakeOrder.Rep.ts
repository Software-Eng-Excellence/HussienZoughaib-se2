import { CSVCakeMapper } from "../mappers/Cake.mapper";
import { CSVOrderMapper } from "../mappers/Order.mapper";
import { IOrder } from "../models/Iorder";
import { parseCSV, writeCSV } from "../util/parser";
import { Orderrepo } from "./Orderrepo";

export class CakeOrderRep extends Orderrepo {
    private mapper=new CSVOrderMapper(new CSVCakeMapper());
    constructor( private readonly filePath: string) {
        super();
    }
     protected async  load(): Promise<IOrder[]> {
        //read the file using csv parser
        const csvdata=await parseCSV(this.filePath);
        //convert the readed file into an object using mapper
      
        const orders=csvdata.map(this.mapper.map.bind(this.mapper));
        return orders;
        //return the array of objects.

    }
    protected async save(orders: IOrder[]): Promise<void> {
        //since the writecsv file methhod dont handel the headers i will make them as constant#
        //then i will transform the orders into csv format
        //finally i will write them into the file using writecsv method
       const headers = [
  "id",
  "Type",
  "Flavor",
  "Filling",
  "Size",
  "Layers",
  "Frosting Type",
  "Frosting Flavor",
  "Decoration Type",
  "Decoration Color",
  "Custom Message",
  "Shape",
  "Allergies",
  "Special Ingredients",
  "Packaging Type",
  "Price",
  "Quantity"
];
     //transform orders into csv format
     const data = orders.map(order =>
    this.mapper.reversemap(order)
     );
    //so i need tto make the mappers make 2 way mapping
    return  await writeCSV(this.filePath,[headers,...data]);

    }
}