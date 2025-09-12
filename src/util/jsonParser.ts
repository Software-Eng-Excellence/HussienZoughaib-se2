import { promises as fs } from 'fs';

export function parseJSON(filePath: string): Promise<object[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            try {
                const data = JSON.parse(fileContent);
                resolve(data as object[]); // This returns the Promise with the object
            } catch (parseError) {
                reject(parseError);
            }
        } catch (readError) {
            reject(readError);
        }
    });
}