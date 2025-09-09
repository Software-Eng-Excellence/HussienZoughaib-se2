
import {FinanceCalculater,ValidateOtrder,OrderManagment} from "./app";
import logger   from "./../util/logger";


const orders = [
  { id: 1, item: "Sponge", price: 15 },
  { id: 2, item: "Chocolate", price: 20 },
  { id: 3, item: "Fruit", price: 18 },
  { id: 4, item: "Red Velvet", price: 25 },
  { id: 5, item: "Coffee", price: 8 },
];



const Ordermanager=new OrderManagment(new ValidateOtrder(),new FinanceCalculater());
for(const  order of orders){
        Ordermanager.addOrder(order.item,order.price);

}

// Adding a new order directly
const newItem = "Marble";
const newPrice = 1;


Ordermanager.addOrder(newItem,newPrice);
logger.info("Orders after adding a newd order:%j", Ordermanager.getOrder());

// Calculate Total Revenue directly

logger.info("Total Revenue:"+   Ordermanager.getRevenue());

// Calculate Average Buy Power directly

logger.info("Average Buy Power:"+ Ordermanager.getBuyPower());

// Fetching an order directly
const fetchId = 2;
//const fetchedOrder = orders.find(order => order.id === fetchId);
logger.info("Order with ID 2:"
  + Ordermanager.FetchOrder(fetchId));

// Attempt to fetch a non-existent order
const nonExistentId = 10;

logger.info("Order with ID 10 (non-existent):"+Ordermanager.FetchOrder(nonExistentId));