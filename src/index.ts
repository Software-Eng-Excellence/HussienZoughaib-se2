
import path, { parse } from 'path';
import { parseCSV} from './util/parser'
import logger from './util/logger';
import { parseJSON } from './util/jsonParser';
import { parseXml } from './util/xmlParser';

const filePath = path.resolve(__dirname, './data/data/cake orders.csv');
const jsonFilePath=path.resolve(__dirname,'./data/data/book orders.json');
const xmlFilePath=path.resolve(__dirname,'./data/data/toy orders.xml');
async function main() {
    try {
        const products = await parseCSV(filePath)
        for (const product of products) {
            logger.info(product);

        }
    } catch(error) {
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
//main();
//main_2();
main_3();