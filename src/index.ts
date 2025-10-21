



import { CakeBuilder } from './models/builder/Cake.builder';
import { BookBuilder } from './models/builder/Book.builder';
import logger from './util/logger';
import { ToyBuilder } from './models/builder/Toy.builder';
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
  
    const bookbuilder=new BookBuilder();
    const book=bookbuilder.setAuthor("George Orwell")
    .setEdition("1st")
    .setFormat("Hardcover")
    .setGenre("Dystopian")
    .setLanguage("English")
    .setPackaging("Standard")
    .setPublisher("Secker & Warburg")
    .setTitle("1984")
    .build();
    logger.info("Book created successfully:");
    logger.info(JSON.stringify(book,null,2));


    }
    

catch(error){
    logger.error('Error creating book:', error);


}
}
async function main_3(){
    try{
        const toyBuilder=new ToyBuilder();
        const toy=toyBuilder.setAgeGroup(3)
        .setBrand("Lego")
        .setBatteriesRequired(false)
        .setEducational(true)
        .setMaterial("Plastic")
        .setType("Building Blocks")
        .build();
        logger.info("Toy created successfully:");
        logger.info(JSON.stringify(toy,null,2));
    }
    catch(error){
        logger.error('Error creating toy:', error);
    }
}

main();
main_2();
main_3();
