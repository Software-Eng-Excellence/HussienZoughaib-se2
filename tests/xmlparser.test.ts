import path from 'path';
import { promises as fs } from 'fs';
import{ parseXml } from '../src/util/xmlParser';
const testFilePath = path.resolve(__dirname, 'test.xml');
beforeAll(async()=>{
    await fs.writeFile(testFilePath, `<data>
    <row>
        <OrderID>5001</OrderID>
        <Type>Plush Toy</Type>
        <AgeGroup>13+</AgeGroup>
        <Brand>FunTime</Brand>
        <Material>Fabric</Material>
        <BatteryRequired>Yes</BatteryRequired>
        <Educational>Yes</Educational>
        <Price>247</Price>
        <Quantity>7</Quantity>
    </row>
    </data>`, 'utf-8');
})
afterAll(async()=>{
   await fs.unlink(testFilePath);
})
describe('XML parser',()=>{
    it('should parse XML file into a JavaScript object',async()=>{
        const result=await parseXml(testFilePath);
        expect(result).toEqual({
            data: {
                row: {
                    OrderID: 5001,
                    Type: 'Plush Toy',
                    AgeGroup: '13+',
                    Brand: 'FunTime',
                    Material: 'Fabric',
                    BatteryRequired: 'Yes',
                    Educational: 'Yes',
                    Price: 247,
                    Quantity: 7
                }
            }
        })
    })
    it('should throw an error if the file does not exist',async()=>{
        await expect(parseXml('non-existent-file.xml')).rejects.toThrow();
    })

}
)