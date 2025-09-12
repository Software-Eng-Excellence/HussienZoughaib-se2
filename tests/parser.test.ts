import { parseCSV } from '../util/parser';
import path from 'path';
const testFilePath = path.resolve(__dirname, 'test.csv');
import { promises as fs } from 'fs';
describe('CSV Parser',()=>{
   it("should pasre the csv into a string",async()=>{
    //arange
    await fs.writeFile(testFilePath,`Order ID,Item,Price
1,Cake,50
2,Red Velvet,60
`,'utf-8');
    //act        
    const result=await parseCSV(testFilePath);
    //act
    expect(result).toEqual([
      ['Order ID', 'Item', 'Price'],
      ['1', 'Cake', '50'],
      ['2', 'Red Velvet', '60']
     
    ])
    
   })
   it("should throw an error if the file does not exist",async()=>{
    await expect(parseCSV('non-existent-file.csv')).rejects.toThrow();
    })
    
})