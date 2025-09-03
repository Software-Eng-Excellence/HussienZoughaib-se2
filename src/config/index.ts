import dotnev from "dotenv";
import path from "path";
dotnev.config({path:path.join(__dirname,'../ ../.env')});
export default{

    secret:process.env.secret || 'secret'
}