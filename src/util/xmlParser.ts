import { promises as fs } from 'fs'
import { XMLParser} from 'fast-xml-parser'
export async function parseXml(filePath:string):Promise<object>{
    try{
        const fileContent=await fs.readFile(filePath,'utf-8');
        const parser=new XMLParser({
            ignoreAttributes:false,
            attributeNamePrefix:'@_',
            textNodeName:'#text',
            parseTagValue:true,
            parseAttributeValue:true,
            trimValues:true,
        });
        const jsonObj=parser.parse(fileContent);
        return jsonObj as object;
    }
    catch(error){
        throw error;
    }

     }
