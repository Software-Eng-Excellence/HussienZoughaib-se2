
import { promises as fs } from 'fs'; // Import the promise-based fs API for async file operations
import {  parse as cvParser } from 'csv-parse'; // Import the CSV parser function
import { stringify as cvStringify } from 'csv-stringify'; // Import the CSV stringifier (not used here, but available)

/**
 * Reads and parses a CSV file into a 2D string array.
 * @param filePath - Path to the CSV file
 * @returns Promise<string[][]> - Resolves with parsed CSV rows
 * @param include_header - Whether to include the header row in the output (default: false)
 */
export async function parseCSV(filePath: string,include_header:boolean=false): Promise<string[][]> {
  try {
    // Read the file content asynchronously as UTF-8 text
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Return a promise that resolves with the parsed CSV data
    return new Promise((resolve, reject) => {
      cvParser(
        fileContent, // The CSV file content as a string
        {
          trim: true, // Remove leading/trailing whitespace from each field
          skip_empty_lines: true // Ignore empty lines in the CSV
        },
        (err, records) => {
          if (err) {
            // If parsing fails, reject the promise with the error
            return reject(err);
          }
          if(!include_header){
            records.shift(); //remove the header row
          }
          // If parsing succeeds, resolve the promise with the records (2D array)
          resolve(records as string[][]);
        }
      );
    });
  } catch (error) {
    // If reading the file fails, throw the error to reject the promise
    throw error;
  }
}
/**
 * Writes a 2D string array to a CSV file.
 * @param filePath - Path to the CSV file
 * @param data - 2D array of strings to write
 * @returns Promise<void> - Resolves when writing is complete
 */
export async function writeCSV(filePath: string, data: string[][]): Promise<void> {
  try {
    const output = await new Promise<string>((resolve, reject) => {
      try {
        cvStringify(
          data,
      

          (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
    await fs.writeFile(filePath, output, 'utf-8');
  } catch (error) {
    throw error;
  }
}

<<<<<<< HEAD:src/util/parser.ts

=======
export async function csv_to_objects(FilePath:string):Promise<object[]>{
  try{
    //raed data form file
    const data=await fs.readFile(FilePath,'utf-8');
    return new Promise((resolve,reject)=>{
      cvParser(data,{
        trim:true,
        skip_empty_lines:true,
         //each row will be converted to an object using the header row as keys       
        //give deatilas about the columns
        columns:true
      },(err,records)=>{
        if(err){
          return reject(err)
        }
        resolve(records as object[])

      })

    }) 


  }
  catch(error){
    throw error
  }

}
>>>>>>> 462c48393d689cbd4779c122243f12114742c942:util/parser.ts

 