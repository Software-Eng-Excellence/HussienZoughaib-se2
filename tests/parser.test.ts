import { parseCSV } from '../src/util/parser';
import path from 'path';
const testFilePath = path.resolve(__dirname, 'test.csv');
import { promises as fs } from 'fs';
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
     
    ])
    
   })
   it("should throw an error if the file does not exist",async()=>{
    await expect(parseCSV('non-existent-file.csv')).rejects.toThrow();
    })
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