import logger from "./util/logger";
import config from "./config";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import cors from "cors";
import reqeustloegger from "./midlleware/requestLogger";
import router from "./router/index";
import { HttpException } from "./util/exceptions/http/HttpExceptions";

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


/*async function runAnalyticsTest() {
    const analyticsService = new OrderManagement();
    const result = await analyticsService.groupOrdersByCategory();
    logger.info("Grouped orders by category:");
   logger.info(JSON.stringify(result, null, 2));

}
*/
/*runAnalyticsTest().catch(err => logger.error(err))*/
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
// After: Enhanced Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if ( err instanceof HttpException) {
        const httpException = err as HttpException;
        // Log includes name, status, message, and details
        logger.error(" %s [%d] \"%s\" %o", httpException.name, httpException.status, httpException.message, httpException.details || {});
        // Response includes message and details
        res.status(httpException.status).json({
            message: httpException.message,
            details: httpException.details || undefined
        });
    } else {
        logger.error("Unhandled Error: %s", err.message);
        res.status(500).json({ 
            message: "Internal Server Error"
        });
    }
})