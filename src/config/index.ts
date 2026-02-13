import dotnev from "dotenv";
import path from "path";
import {StringValue} from "ms"
import { INSPECT_MAX_BYTES } from "buffer";
dotnev.config({path:path.join(__dirname,'../ ../.env')});
export default {
NODE_ENV: process.env.NODE_ENV || 'development',
isProduction: process.env.NODE_ENV === 'production', // Checks if the environment type (e.g., 'production' or 'development') is set; if not, it uses 'development' as default.
logDir: 'logs', // Specifies the folder where log files will be saved.
Storage:{
    CSV:{
        cake:"src/data/Cake orders.csv"
    },
    sqlite: "src/data/orders.db",
    postgres:'postgresql://neondb_owner:npg_vYRUnoM9L2qV@ep-sweet-tooth-a415mlko-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    

},
port: process.env.PORT ? parseInt(process.env.PORT) : 3000, // Sets the port number for the application to listen on. It checks if a PORT environment variable is set; if not, it defaults to 3000.
host: process.env.HOST || 'localhost', // Sets the host address for the application. It checks if a HOST environment variable is set; if not, it defaults to 'localhost'.
auth:{
    jwtSecret: process.env.JWT_SECRET || 'secret_1234567890', // Sets the secret key used for signing JSON Web Tokens (JWTs). It checks if a JWT_SECRET environment variable is set; if not, it defaults to
    expiration:(process.env.JWT_EXPIRATION || '15m') as StringValue,
     refreshExpiration:(process.env.JWT_REFRESH_EXPIRATION || '7d') as StringValue,
     // Sets the expiration time for JWTs. It checks if a JWT_EXPIRATION environment variable is set; if not, it defaults to '1h' (1 hour).
}
};