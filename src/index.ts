


import logger from './util/logger';
import crypto from 'crypto'
import { parseCSV } from './util/parser';
import { CSVCakeMapper } from './mappers/Cake.mapper';
import { CSVOrderMapper } from './mappers/Order.mapper';
import { parseXml } from './util/xmlParser';
import { ToyMapper } from './mappers/Toy.mapper'; // fixed relative import
import { parseJSON } from './util/jsonParser';
import { BookMapper } from './mappers/Book.mapper';
import { CakeOrderRep } from './repository/file/CakeOrder.Rep';

import config from './config';
import { Orderrepo } from './repository/sqlite/Orderrepo';
import { CakeOrderRepo } from './repository/sqlite/CakeOrder.Repo';
import { CakeBuilder, IndentCakeBuilder } from './models/builder/Cake.builder';
import { IdentfOrderBuilder, OrderBuilder } from './models/builder/Order.builder';
import { Orderrep } from './repository/Postgr sql/Order.Repo';
import { CakeOrderRepp } from './repository/Postgr sql/CakeOrder.Repo';

import { ToyOrderRepo } from './repository/Postgr sql/ToyOrder.Repo';
import { IdentfToyBuilder, ToyBuilder } from './models/builder/Toy.builder';
import { BookRep } from './repository/Postgr sql/Book.Repo';
import { BookBuilder, IDENBookBuilder } from './models/builder/Book.builder';
import { DBMode, RepositoryFactory } from './repository/Repo.factory';
import { ItemCategory } from '././models/Iitem';



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

        const order_Repo=await RepositoryFactory.create( DBMode.SQLITE,ItemCategory.Cake);

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
async function DBsandbox_2() {
    try {
        const order_Repo = await RepositoryFactory.create(DBMode.PostgrSQL, ItemCategory.Cake);
        const Order_Repo_2 = await RepositoryFactory.create(DBMode.PostgrSQL, ItemCategory.Toy);
        const Order_Repo3=await RepositoryFactory.create(DBMode.PostgrSQL,ItemCategory.Book);

  

        // ---- Create Cake ----
        const cake = CakeBuilder.createBuilder()
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
            .setAllergies("Nut-Free")
            .setSpIng("Organic Ingredients")
            .setPackageType("Standard Box")
            .build();

        const indentCake = IndentCakeBuilder.createBuilder()
            .setId(crypto.randomUUID())       // << UNIQUE CAKE ID
            .setCake(cake)
            .build();

        // ---- Create Toy ----
        const toy = ToyBuilder.createBuilder()
            .setType('aa')
            .setAgeGroup(22)
            .setBrand('amazon')
            .setMaterial('2zez')
            .setBatteriesRequired(false)
            .setEducational(true)
            .build();
    
        const idToy = IdentfToyBuilder.createBuilder()
            .setId(crypto.randomUUID())       // << UNIQUE TOY ID
            .setToy(toy)
            .build();
             const toy_2 = ToyBuilder.createBuilder()
            .setType('bb')
            .setAgeGroup(2)
            .setBrand('amzon')
            .setMaterial('2ez')
            .setBatteriesRequired(false)
            .setEducational(true)
            .build();
    
        const idToy_2 = IdentfToyBuilder.createBuilder()
            .setId(crypto.randomUUID())       // << UNIQUE TOY ID
            .setToy(toy)
            .build();

            //create Book
          const book=BookBuilder.createBuilder().setTitle('330').setAuthor('hussine').setGenre('comedy').setFormat('essay').setLanguage('arabic').setPublisher('haayat').setEdition('2202').setPackaging('goog').build();
        const idbook=IDENBookBuilder.createBuilder().setId(crypto.randomUUID()).setBook(book).build();
        
        // ---- Create Order #1 (Cake Order) ----
        const order1 = OrderBuilder.createBuilder()
            .setPrice(29)
            .setItem(cake)
            .setQuantity(2)
            .setId(crypto.randomUUID())       // << UNIQUE ORDER ID
            .build();

        const identforde1r = IdentfOrderBuilder.createBuilder()
            .setOrder(order1)
            .setItem(indentCake)
            .build();

        // ---- Create Order #2 (Toy Order) ----
        const order_2 = OrderBuilder.createBuilder()
            .setPrice(30)
            .setItem(toy)
            .setQuantity(33)
            .setId(crypto.randomUUID())       // << UNIQUE ORDER ID
            .build();

        const iorder_2 = IdentfOrderBuilder.createBuilder()
            .setOrder(order_2)
            .setItem(idToy)
            .build();
            const order_toy=OrderBuilder.createBuilder().setPrice(44).setItem(toy_2).setQuantity(555).setId(crypto.randomUUID()).build();
            const iorder_toy=IdentfOrderBuilder.createBuilder().setOrder(order_toy).setItem(idToy_2).build();
        //create order3
        const order_3=OrderBuilder.createBuilder().setPrice(3330).setItem(book).setQuantity(33).setId(crypto.randomUUID()).build();
        const iorder_3=IdentfOrderBuilder.createBuilder().setOrder(order_3).setItem(idbook).build();
        // ---- INSERT INTO REPOS ----
        const id = await order_Repo.create(identforde1r);
        const id_2 = await Order_Repo_2.create(iorder_2);
        const id_3=await Order_Repo3.create(iorder_3);
        const id_4=await Order_Repo_2.create(iorder_toy);
        logger.info("Orders created successfully");
         
       // console.log(await order_Repo.get(id));
        //console.log(await Order_Repo_2.get(id_2));
        //console.log(await Order_Repo3.get(id_3));
        //console.log(await Order_Repo_2.get(id_4));
        console.log(await Order_Repo_2.getALL());
        await Order_Repo_2.delete(id_4);
        logger.info('deleted suces');
        console.log(await Order_Repo_2.getALL());


    }
    catch (error) {

        logger.error(error);
    }
}
DBsandbox_2()
//DBsandbox().catch((error)=>logger.error(error));
//main();
//main_2();
//main_3();
