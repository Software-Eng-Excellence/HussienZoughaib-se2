
import path from 'path';
import {csv_to_objects, parseCSV,} from '../util/parser'
import logger from '../util/logger';
import { json } from 'stream/consumers';

const filePath = path.resolve(__dirname, './data/Cake orders.csv');

async function main() {
    try {
        const products = await parseCSV(filePath)
        for (const product of products) {
            logger.info(product);

        }
    } catch(error) {
        logger.error(error)
    }
       try {
        //to objects 
        const products =  await csv_to_objects(filePath)
        for (const product of products) {
            logger.info(JSON.stringify(product, null, 2));



        }
    } catch(error) {
        logger.error(error)
    }

}

main();