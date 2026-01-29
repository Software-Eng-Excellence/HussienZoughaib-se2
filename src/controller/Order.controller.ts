import { NextFunction ,Request,Response} from "express";
import { OrderManagement } from "../service/OrderMangmnet";

import { IIdentfaibleOrderItem } from "../models/Iorder";
import { JsonFactorry } from "../mappers";

import { BadRequestException } from "../util/exceptions/http/BadRequestException";

export class OrderController{
    //private orderManagement: OrderManagement;
    constructor(private  readonly orderManagement: OrderManagement){
         
    }
    //create order
    public async CreateOrder(req:Request,res:Response){
      

            const orderData:IIdentfaibleOrderItem=JsonFactorry.createMapper(req.body.category).map(req.body);

            
            //create order logic here
            if(!orderData){
                throw new Error("Invalid order data");
            }
            const order=await this.orderManagement.create(orderData);
            res.status(201).json({message:"Order created successfully",order});
 
      
    }   
    //get order by id
    public async GetOrder(req:Request,res:Response){

            const orderId=req.params.id;
            if(!orderId){
                throw new BadRequestException("Id is required",{
                    idNotDefined:true
                });
            }
            //fetch order logic here
         
            const order=await this.orderManagement.get(orderId);
            const target=JsonFactorry.createMapper(order.getItem().getCategory()).reversemap(order);
            res.status(200).json({message:`Order ${orderId} fetched successfully`,order:target});
            //
            
           

  
     
        }
       
        public async GetAllOrders(req:Request,res:Response){
        
                const orders=await this.orderManagement.getAll();
                console.log("Fetched Orders:%o", orders);
                const result=orders.map(order=>JsonFactorry.createMapper(order.getItem().getCategory().toString()).reversemap(order));
                res.status(200).json({message:"Orders fetched successfully",orders:result});

         


        
    }
    public async UpdateOrder(req:Request,res:Response){
  
            const id=req.params.id;
            console.log(id);
             if (!id) {
        throw new BadRequestException("Id is required to update order", {
            idNotDefined: true // Detail!
        });}

            const orderData:IIdentfaibleOrderItem=JsonFactorry.createMapper(req.body.category).map(req.body);
            if(!orderData){
                throw new Error("Invalid order data");
            }
            console.log(id);
            console.log(orderData.getId());
           if (orderData.getId() !== id) {
        throw new BadRequestException("Id in body is different from id in param", {
            idNotSame: true, // More details!
            idInBody: orderData.getId(),
            idInParam: id
        });
    }
            const updatedOrder=await this.orderManagement.update(orderData);
            res.status(200).json({message:`Order ${id} updated successfully`,updatedOrder});

       

        
}
async DeletOrder(req:Request,res:Response){

        const id=req.params.id;
        if(!id){
        throw new BadRequestException("Id is required to delete order",{
            idNotDefined:true
        });
    }
        await this.orderManagement.delete(id);
        res.status(200).json({message:`Order ${id} deleted successfully`});

   
  
}

}
