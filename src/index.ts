
import logger from './util/logger';

import { parseCSV } from './util/parser';
import { CSVCakeMapper } from './mappers/Cake.mapper';
import { CSVOrderMapper } from './mappers/Order.mapper';
import { parseXml } from './util/xmlParser';
import { ToyMapper } from './mappers/Toy.mapper'; // fixed relative import
import { parseJSON } from './util/jsonParser';
import { BookMapper } from './mappers/Book.mapper';

async function main() {
    try {
        const CSVdata = await parseCSV("src/data/Cake orders.csv");
        const cakemapper = new CSVCakeMapper();
        const order = new CSVOrderMapper(cakemapper);
        const list_ordres = CSVdata.map(r => order.map(r));
        logger.info("Cakes order successfully:");
        logger.info('list of cakes:\n %o', list_ordres); // fixed newline

        // for toys: parseXml returns an object, normalize to array and convert each row -> string[]
     
    } catch (error) {
        logger.error(error);
    }
}
async function main_2(){
try{
 const xmldata: any = await parseXml("src/data/toy orders.xml");
        const rawRows = xmldata?.data?.row;
        const rows = rawRows ? (Array.isArray(rawRows) ? rawRows : [rawRows]) : [];

        const toyMapper = new ToyMapper();
        const order_2 = new CSVOrderMapper(toyMapper);

        const rowToStringArray = (row: any): string[] => {
            if (!row) return [];
            if (Array.isArray(row)) return row.map(v => String(v ?? ''));
            // Fast-XML-Parser often uses { '#text': 'value' } shapes; prefer '#text' or primitive values
            return Object.keys(row).map(k => {
                const v = row[k];
                if (v == null) return '';
                if (typeof v === 'object') return String(v['#text'] ?? v['@_'] ?? '');
                return String(v);
            });
        };

        const list_ordres_2 = rows.map(r => order_2.map(rowToStringArray(r)));

        logger.info("toys order successfully:");
        logger.info('list of toys:\n %o', list_ordres_2);
}
catch(error){
    logger.error(error);
}
}

async function main_3(){
    try{

        const bookdata=await parseJSON("src/data/book orders.json");
        const bookmappper=new BookMapper();
        const order_3=new CSVOrderMapper(bookmappper);
        const list_ordres_3=bookdata.map(r=>order_3.map(Object.values(r).map(v=>String(v??''))));
        logger.info("books order successfully:");
        logger.info('list of books:\n %o', list_ordres_3);
    }
    catch(error){
        logger.error(error);
    }
}
//main();
//main_2();
main_3();

