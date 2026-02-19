import { AnaltycService } from "service/AnaltycService";
import { Request,Response} from "express";
export class AnaltycController{
    constructor(private readonly analtycService:AnaltycService){

    }
    public  async GetTotalRevenue(req:Request,res:Response){

        const revn=await this.analtycService.getTotalRevenue();
         res.status(200).json({totalRevenue:revn});

    }
    public async GetTotalOrders(req:Request,res:Response){
        const totalOrders=await this.analtycService.getTotalOrders();
        res.status(200).json({totalOrders});
    }
    public async GetOrdersByCategory(req:Request,res:Response){
        const data=await this.analtycService.groupOrdersByCategory();
        res.status(200).json(data);
    }
    public async GenrateRevenueByCategory(req:Request,res:Response){
     const data=await this.analtycService.GenerateRevenueByCategory();
     res.status(200).json(data);
    }
}

