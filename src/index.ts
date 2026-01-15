import logger from "./util/logger";
import config from "./config";
import express  from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import reqeustloegger from "./midlleware/requestLogger";
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
app.get('/',(req,res)=>{
    res.send('Hello World!');
});