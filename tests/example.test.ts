//import { describe, it, expect } from '@jest/globals';
//always start with a description of the functionality you are testing    

import {    OrderManagment,ValidateOtrder ,FinanceCalculater, Order} from '../src/app';
//here i can use befor all since each time i iniate a validater and a calculater
//and befor each test im makimng a new order manager
let validater: ValidateOtrder;
let Calculater: FinanceCalculater;
let orderManager: OrderManagment;
let Base_validater:(order:Order)=>void;
beforeAll(() => {
    validater = new ValidateOtrder();
    Calculater = new FinanceCalculater();
});
beforeEach(() => {
  Base_validater=validater.validate;
  validater.validate=jest.fn();
    orderManager = new OrderManagment(validater, Calculater);
});
afterEach(() => {
    validater.validate=Base_validater;
})
describe('Order functins', () => {

    it('should add and order correctly', () => {
        //AAA
        //Arange
   //     const validater=new  ValidateOtrder ();
     //   const Calculater=new FinanceCalculater();
       // const orderManager = new OrderManagment(validater,Calculater);
        const item = 'Chocolate';
        const price = 50;
        //Act
        orderManager.addOrder(item, price);
        //Assert
        expect(orderManager.getOrder()).toEqual([{ id: 1, item, price }]);

     }),
    it('should get a specific orderby ID',()=>{
        //Arange
        //const validater=new  ValidateOtrder ();
       /// const Calculater=new FinanceCalculater();
         //const Ordermanager=new OrderManagment(validater,Calculater);
        const item = 'Chocolate';
        const price = 50;     
         //Act
            orderManager.addOrder(item, price);
        const fetchedOrder = orderManager.FetchOrder(1);
        //Assert
        expect(fetchedOrder).toEqual({ id: 1, item, price });
    }),
    it('should see if the get revenue is called properly',()=>{
      //Arnage
      const item='Chocolate';
      const price=50;
      orderManager.addOrder(item,price);
      const spy=jest.spyOn(Calculater,"Calculate_Revenue");
      //Act
      const revenue=orderManager.getRevenue();
      //Assert
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith([{id:1,item,price}]

      );
      expect(spy).toHaveNthReturnedWith(1, 50);

    })
    it('should thriw an error if the order is invalid',()=>{
      //Arange
      const item='phone';
      const price=-50;
      (validater.validate as jest.Mock).mockImplementation(()=>{
        throw new Error("Invalid order");
      }
      );
      //Act & Assert
      expect(() => orderManager.addOrder(item, price)).toThrow("Failed to add order: Invalid order");

    });

});
describe('FinanceCalculater functions', () => {
    it('should calculate total revenue correctly', () => {
        //Arange
      //  const Calculater=new FinanceCalculater();
        const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 },
            { id: 4, item: "Red Velvet", price: 25 },
            { id: 5, item: "Coffee", price: 8 },
          ];
          //Act
          const totalRevenue = Calculater.Calculate_Revenue(orders);
          //Assert
            expect(totalRevenue).toBe(86);
    })
    it('should calculate average buy power correctly', () => {
        //Arange
      //  const Calculater=new FinanceCalculater();
        const orders = [
            { id: 1, item: "Sponge", price: 15 },
            { id: 2, item: "Chocolate", price: 20 },
            { id: 3, item: "Fruit", price: 18 },
            { id: 4, item: "Red Velvet", price: 25 },
            { id: 5, item: "Coffee", price: 8 },
          ];
            //Act
            const averageBuyPower = Calculater.Calculate_Buy_Power(orders);
            //Assert
            expect(averageBuyPower).toBeCloseTo(17.2);
    })
})