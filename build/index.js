"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("app");
const orders = [
    { id: 1, item: "Sponge", price: 15 },
    { id: 2, item: "Chocolate", price: 20 },
    { id: 3, item: "Fruit", price: 18 },
    { id: 4, item: "Red Velvet", price: 25 },
    { id: 5, item: "Coffee", price: 8 },
];
const Ordermanager = new app_1.OrderManagment(new app_1.ValidateOtrder(), new app_1.FinanceCalculater());
for (const order of orders) {
    Ordermanager.addOrder(order.item, order.price);
}
// Adding a new order directly
const newItem = "Marble";
const newPrice = 22;
Ordermanager.addOrder(newItem, newPrice);
console.log("Orders after adding a newd order:", Ordermanager.getOrder());
// Calculate Total Revenue directly
console.log("Total Revenue:", Ordermanager.getRevenue());
// Calculate Average Buy Power directly
console.log("Average Buy Power:", Ordermanager.getBuyPower());
// Fetching an order directly
const fetchId = 2;
//const fetchedOrder = orders.find(order => order.id === fetchId);
console.log("Order with ID 2:", Ordermanager.FetchOrder(fetchId));
// Attempt to fetch a non-existent order
const nonExistentId = 10;
console.log("Order with ID 10 (non-existent):", Ordermanager.FetchOrder(nonExistentId));
//# sourceMappingURL=index.js.map