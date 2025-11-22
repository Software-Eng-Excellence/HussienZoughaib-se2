import dotnev from "dotenv";
import path from "path";
dotnev.config({path:path.join(__dirname,'../ ../.env')});
export default {
NODE_ENV: process.env.NODE_ENV || 'development', // Checks if the environment type (e.g., 'production' or 'development') is set; if not, it uses 'development' as default.
logDir: 'logs', // Specifies the folder where log files will be saved.
Storage:{
    CSV:{
        cake:"src/data/Cake orders.csv"
    },
    sqlite: "src/data/orders.db",
    postgres:'postgresql://neondb_owner:npg_vYRUnoM9L2qV@ep-sweet-tooth-a415mlko-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    

}
  
};