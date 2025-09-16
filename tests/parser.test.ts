<<<<<<< HEAD
import { parseCSV,writeCSV } from '../src/util/parser';
import path from 'path';

import { promises as fs } from 'fs';
const testFilePath = path.resolve(__dirname, 'test.csv');
const outpiutFilePath=path.resolve(__dirname,'output.csv');
beforeAll(async()=>{
  await fs.writeFile(testFilePath, `Name , Age , City
  Alice  ,  30 , New York  
  Bob ,25 ,  London 
`, 'utf-8');
})
afterAll(async()=>{
   await fs.unlink(testFilePath);

})
describe('CSV Parser',()=>{
   it("should pasre the csv into a string",async()=>{
       
    const result=await parseCSV(testFilePath);
    //act
    expect(result).toEqual([
      
      ['Alice','30','New York'],
      ['Bob', '25', 'London']
=======
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
>>>>>>> 462c48393d689cbd4779c122243f12114742c942
     
    ])
    
   })
   it("should throw an error if the file does not exist",async()=>{
    await expect(parseCSV('non-existent-file.csv')).rejects.toThrow();
    })
<<<<<<< HEAD
   it('should remove white spaces',async()=>{
 
const result=await parseCSV(testFilePath);
       expect(result).toEqual([
      
      ['Alice', '30', 'New York'],
      ['Bob', '25', 'London'],
    ]);
   }
  )
    it('should include header if specified',async()=>{
      const result=await parseCSV(testFilePath,true);
       expect(result).toEqual([
      ['Name', 'Age', 'City'],
      ['Alice', '30', 'New York'],
      ['Bob', '25', 'London'],
    ]);
   }
  )
  
  })
  describe('CSV Writer',()=>{
    it('should write data to a CSV file',async()=>{
      const data=[
        ['Name', 'Age', 'City'],
        ['Alice', '30', 'New York'],
      ];
      await writeCSV(outpiutFilePath,data);
      const fileContent=await fs.readFile(outpiutFilePath,'utf-8');
      expect(fileContent).toBe(`Name,Age,City
Alice,30,New York
`);
      await fs.unlink(outpiutFilePath);
    }
  )


  })
=======
    
})
>>>>>>> 462c48393d689cbd4779c122243f12114742c942
