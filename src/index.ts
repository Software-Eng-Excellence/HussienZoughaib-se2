



import { CakeBuilder } from './models/builder/Cake.builder';
import { BookBuilder } from './models/builder/Book.builder';
import logger from './util/logger';
import { ToyBuilder } from './models/builder/Toy.builder';
import { parseCSV } from './util/parser';
import { CSVCakeMapper } from './mappers/Cake.mapper';
import { CSVOrderMapper } from './mappers/Order.mapper';
async function main() {
    try{
        const data= await parseCSV ("src/data/Cake orders.csv");
        const cakemapper= new CSVCakeMapper();
         const order=new CSVOrderMapper(cakemapper);
         const list_ordres=data.map(r=>order.map(r));
         logger.info("Cakes order successfully:");
            logger.info('list of cakes: /n %o',list_ordres);




       
    

        }
     catch(error) {
        logger.error(error)
    }
}

main();

