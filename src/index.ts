import logger from './util/logger';

import { parseCSV } from './util/parser';
import { CSVCakeMapper } from './mappers/Cake.mapper';
import { CSVOrderMapper } from './mappers/Order.mapper';
import { parseXml } from './util/xmlParser';
import { ToyMapper } from './mappers/Toy.mapper'; // fixed relative import
import { parseJSON } from './util/jsonParser';
import { BookMapper } from './mappers/Book.mapper';
import { CakeOrderRep } from './repository/file/CakeOrder.Rep';
import {Database} from 'sqlite3';
import { open } from 'sqlite';
import config from './config';
import { Orderrepo } from './repository/sqlite/Orderrepo';
import { CakeOrderRepo } from './repository/sqlite/CakeOrder.Repo';
import { CakeBuilder, IndentCakeBuilder } from './models/builder/Cake.builder';
import { IdentfOrderBuilder, OrderBuilder } from './models/builder/Order.builder';
import { Order } from 'models/order.model';

async function main() {
    try {
    ;
        const data = new CakeOrderRep(config.Storage.CSV.cake);
        const list_ordres = await data.get("1");
      
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
async function DBsandbox(){
    try{

        const order_Repo=new Orderrepo(new CakeOrderRepo());
    await order_Repo.init();
     const cake=CakeBuilder.createBuilder()
     .setType("Birthday")
     .setFlavor("Chocolate")
     .setFilling("Cream")
     .setSize(8)
     .setLayer(2)
     .setFrostingType("Buttercream")
     .setFrostingFlavor("Vanilla")
     .setDecType("Sprinkles")
     .setDecColor("Rainbow")
     .setCustomMessage("Happy Birthday!")
     .setShape("Round")
     .setAllergies("Nut-Free")         // required by builder
     .setSpIng("Organic Ingredients")   // required by builder (spIng)
     .setPackageType("Standard Box")    // required by builder
     .build();
        const indentCake=IndentCakeBuilder.createBuilder()
        .setId("cake-001")
        .setCake(cake)
        .build();
       ;

       ;
 const order1=OrderBuilder.createBuilder().setPrice(29.99).setItem(cake).setQuantity(2).setId("124").build();
 const identforde1r=IdentfOrderBuilder.createBuilder().setOrder(order1).setItem(indentCake).build();

  const id=await order_Repo.create(identforde1r);

 logger.info("Order created successfully");
console.log(await order_Repo.get(id));
console.log(await order_Repo.getALL());
await order_Repo.delete(id);
console.log('deleted suces');
console.log(await order_Repo.getALL());

    }
    catch(error){
        logger.error(error);
    }
 

    } 

DBsandbox().catch((error)=>logger.error(error));
//main();
//main_2();
//main_3();
