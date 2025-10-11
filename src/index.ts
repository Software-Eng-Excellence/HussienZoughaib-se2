
import path, { parse } from 'path';
import { parseCSV} from './util/parser'
import logger from './util/logger';
import { parseJSON } from './util/jsonParser';
import { parseXml } from './util/xmlParser';
import { Cake } from 'models/Cake.model';
import { CakeBuilder } from './models/builder/Cake.builder';

const filePath = path.resolve(__dirname, './data/data/cake orders.csv');
const jsonFilePath=path.resolve(__dirname,'./data/data/book orders.json');
const xmlFilePath=path.resolve(__dirname,'./data/data/toy orders.xml');
async function main() {
    try{
        const cakeBuilder = new CakeBuilder();
    const cake=cakeBuilder.setAllergies("Nuts").
        setCustomMessage("Happy Birthday!")
        .setDecColor("Red")
        .setDecType("Sprinkles")
        .setFilling("Vanilla Cream")
        .setFlavor("Chocolate")
        .setFrostingFlavor("Chocolate")
        .setFrostingType("Buttercream")
        .setLayer(3)
        .setPackageType("Box")
        .setShape("Round")
        .setSize(10)
    .setSpIng("Coffee Syrup")
        .setType("Chocolate")
        .build();
       
        logger.info("Cake created successfully:");
        logger.info(JSON.stringify(cake, null, 2));    
        
    

        }
     catch(error) {
        logger.error(error)
    }
}
async function main_2(){
try{
    const data =await parseJSON(jsonFilePath);
    for(const item of data){
 logger.info(JSON.stringify(item));
    }
    
}
catch(error){
    logger.error(error);


}
}
async function main_3(){
    try{
        const data=await parseXml(xmlFilePath);
        logger.info(JSON.stringify(data,null,2));

    }
    catch(error){
        logger.error(error);
    }
}
main();
//main_2();
//main_3();
