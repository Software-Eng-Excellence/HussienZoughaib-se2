import { CakeOrderRepp } from '.././src/repository/Postgr sql/CakeOrder.Repo';
import { ConnectionManager } from '../src/repository/Postgr sql/ConnectionManager';
import { DBException, RepositoryInitializationException } from '../src/util/exceptions/RepoException';
jest.mock(".././src/util/logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));
jest.mock('.././src/repository/Postgr sql/ConnectionManager', () => ({
    ConnectionManager: {
        getConnection: jest.fn()
    }
}));
let mockConnection:any;
beforeAll(() => {
    mockConnection = {
        query: jest.fn(),
        release: jest.fn()
    };
});
beforeEach(() => {
    jest.clearAllMocks();
});

describe('CakeOrderRepo.init()', () => {

    it('should initialize successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});

        const repo = new CakeOrderRepp();
        await repo.init();

        expect(ConnectionManager.getConnection).toHaveBeenCalledTimes(1);
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it('should throw if getConnection fails', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockRejectedValueOnce(new Error("DB Down"));

        const repo = new CakeOrderRepp();

        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);
        expect(mockConnection.release).not.toHaveBeenCalled();
    });

    it('should throw if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Bad SQL"));

        const repo = new CakeOrderRepp();

        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
describe('CakeOrderRepo.create()',()=>{

    it('should insert  the data successfully',async()=>{
          (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new CakeOrderRepp();
        const mockCake:any={
            getId:()=> '1',
            getType:()=> 'type',
            getFlavor:()=> 'flavor',
            getFilling:()=> 'filling',
            getSize:()=> 'size',
            getLayer:()=> 2,
            getFrostingType:()=> 'frostingType',
            getFrostingFlavor:()=> 'frostingFlavor',
            getDecType:()=> 'decorationType',
            getDecColor:()=> 'decorationColor',
            getCustomMessage:()=> 'customMessage',  
            getShape:()=> 'shape',
            getAllergies:()=> 'allergies',
            getSpecialIngredients:()=> 'specialIngredients',
            getPackageType:()=> 'packageType'
        };
        const id= await repo.create (mockCake);
        expect(id).toBe('1');
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    })
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Insert Failed"));
        const repo = new CakeOrderRepp();
        const mockCake:any={
            getId:()=> '1',
            getType:()=> 'type',
            getFlavor:()=> 'flavor',
            getFilling:()=> 'filling',
            getSize:()=> 'size',    
            getLayer:()=> 2,
            getFrostingType:()=> 'frostingType',
            getFrostingFlavor:()=> 'frostingFlavor',
            getDecType:()=> 'decorationType',
            getDecColor:()=> 'decorationColor',
            getCustomMessage:()=> 'customMessage',
            getShape:()=> 'shape',
            getAllergies:()=> 'allergies',
            getSpecialIngredients:()=> 'specialIngredients',
            getPackageType:()=> 'packageType'
        };
        await expect( repo.create (mockCake)).rejects.toThrow(DBException);
        expect( mockConnection.release).toHaveBeenCalledTimes(1);
    });


})
describe('CakeOrderRepo.get(id)', () => {

    it('should retrieve the data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);

        const mockDbResult = {
            rows: [{
                id: '1',
                type: 'type',
                flavor: 'flavor',
                filling: 'filling',
                size: 8,
                layers: 2,
                frosting_type: 'frostingType',
                frosting_flavor: 'frostingFlavor',
                decoration_type: 'decorationType',
                decoration_color: 'decorationColor',
                custom_message: 'customMessage',
                shape: 'circle',
                allergies: 'none',
                special_ingredients: 'specialIngredients',
                package_type: 'packageType'
            }]
        };

        mockConnection.query.mockResolvedValueOnce(mockDbResult);

        const repo = new CakeOrderRepp();
        const cake = await repo.get('1');

        expect(cake.getId()).toBe('1');
        expect(cake.getType()).toBe('type');
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Select Failed"));

        const repo = new CakeOrderRepp();
        await expect(repo.get('1')).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });   
});
describe('CakeOrderRepo.getALL()', () => {

    it('should retrieve all data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);

        const mockDbResult = {
            rows: [
                {
                    id: '1',
                    type: 'type1',
                    flavor: 'flavor1',
                    filling: 'filling1',
                    size: 8,
                    layers: 2,
                    frosting_type: 'frostingType1',
                    frosting_flavor: 'frostingFlavor1',
                    decoration_type: 'decorationType1',
                    decoration_color: 'decorationColor1',
                    custom_message: 'customMessage1',
                    shape: 'circle',
                    allergies: 'none',
                    special_ingredients: 'specialIngredients1',
                    package_type: 'packageType1'
                },
                {
                    id: '2',
                    type: 'type2',  
                    flavor: 'flavor2',
                    filling: 'filling2',
                    size: 10,
                    layers: 3,
                    frosting_type: 'frostingType2',
                    frosting_flavor: 'frostingFlavor2',
                    decoration_type: 'decorationType2',
                    decoration_color: 'decorationColor2',
                    custom_message: 'customMessage2',
                    shape: 'square',
                    allergies: 'nuts',
                    special_ingredients: 'specialIngredients2',
                    package_type: 'packageType2'
                }
            ]
        };
        mockConnection.query.mockResolvedValueOnce(mockDbResult);

        const repo = new CakeOrderRepp();
        const cakes = await repo.getALL();
        expect(cakes.length).toBe(2);
        expect(cakes[0].getId()).toBe('1');
        expect(cakes[1].getId()).toBe('2');
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
})
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Select All Failed"));
        const repo = new CakeOrderRepp();
        await expect(repo.getALL()).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
describe('CakeOrderRepo.update()', () => {

    it('should update the data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new CakeOrderRepp();
        const mockCake:any={
            getId:()=> '1',
            getType:()=> 'type',
            getFlavor:()=> 'flavor',
            getFilling:()=> 'filling',
            getSize:()=> 'size',    
            getLayer:()=> 2,    
            getFrostingType:()=> 'frostingType',
            getFrostingFlavor:()=> 'frostingFlavor',

            getDecType:()=> 'decorationType',
            getDecColor:()=> 'decorationColor',
            getCustomMessage:()=> 'customMessage',
            getShape:()=> 'shape',
            getAllergies:()=> 'allergies',
            getSpecialIngredients:()=> 'specialIngredients',
            getPackageType:()=> 'packageType'
        };
        await repo.update (mockCake);
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    })
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)  

            .mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Update Failed"));
        const repo = new CakeOrderRepp();
        const mockCake:any={
            getId:()=> '1',
            getType:()=> 'type',
            getFlavor:()=> 'flavor',
            getFilling:()=> 'filling',
            getSize:()=> 'size',    
            getLayer:()=> 2,    
            getFrostingType:()=> 'frostingType',
            getFrostingFlavor:()=> 'frostingFlavor',
            getDecType:()=> 'decorationType',
            getDecColor:()=> 'decorationColor',
            getCustomMessage:()=> 'customMessage',
            getShape:()=> 'shape',
            getAllergies:()=> 'allergies',
            getSpecialIngredients:()=> 'specialIngredients',
            getPackageType:()=> 'packageType'
        };
        await expect( repo.update (mockCake)).rejects.toThrow(DBException);
        expect( mockConnection.release).toHaveBeenCalledTimes(1);
    });
}
);describe('CakeOrderRepo.delete()', () => {

    it('should delete the data successfully', async () => { 
        (ConnectionManager.getConnection as jest.Mock)

            .mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new CakeOrderRepp();
        await repo.delete ('1');
         expect(mockConnection.query).toHaveBeenCalledTimes(1);
    })
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Delete Failed"));
        const repo = new CakeOrderRepp();
        await expect( repo.delete ('1')).rejects.toThrow(DBException);
        expect( mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
