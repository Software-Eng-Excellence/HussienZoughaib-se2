import {parseJSON} from '../src/util/jsonParser';
import { promises as fs } from 'fs';
import path from 'path';
const testFilePath = path.resolve(__dirname, 'test.json');
beforeAll(async()=>{
  await fs.writeFile(testFilePath, `[
    {"name": "Alice", "age": 30, "city": "New York"},
    {"name": "Bob", "age": 25, "city": "London"}
]`, 'utf-8');
})
afterAll(async()=>{
   await fs.unlink(testFilePath);

})
describe('Json parser',()=>{
    it('should parse JSON file into an array of objects',async()=>{

        const result=await parseJSON(testFilePath);
        expect(result).toEqual([
            {name:'Alice',age:30,city:'New York'},
            {name:'Bob',age:25,city:'London'}
        ])
    })
    it('should throw an error if the file does not exist',async()=>{
        await expect(parseJSON('non-existent-file.json')).rejects.toThrow();
    })
})