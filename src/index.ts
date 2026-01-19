import logger from "./util/logger";
import config from "./config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import reqeustloegger from "./midlleware/requestLogger";
import router from "./router/index";
import { ApiException } from "./util/exceptions/ApiException";
const app=express();
//for security headers
app.use(helmet());
//use body parser
app.use(bodyParser.json());
//to support URL-encoded bodies
app.use(bodyParser.urlencoded({extended:true}));
//use corse
app.use(cors({
    origin:'*'//in production, specify allowed origins
}))
//adding request handler mdidleware
app.use(reqeustloegger);
app.listen(config.port,config.host,()=>{
    logger.info(`Server is running at http://${config.host}:${config.port}`);
});
app.use('/',router);
//404 handler
app.use((req,res)=>{
    res.status(404).json({error:'Not Found'});
})
//make and error hadnler
app.use((err:Error, req:Request, res:Response, next:NextFunction)=>{
  if(err instanceof ApiException) {
    const apiError=err as ApiException;
    logger.error(`API Error of status %d: %s`,apiError.status, err.message);
    res.status(apiError.status).json({error:apiError.message});

    
  } else {
    logger.error(`Error occurred: ${err.message}`);
    res.status(500).json({error:'Internal Server Error'});
  }
});