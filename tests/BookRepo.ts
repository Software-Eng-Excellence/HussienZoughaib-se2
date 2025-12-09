import { format } from "winston";
import { BookRep } from "../src/repository/Postgr sql/Book.Repo";
import { ConnectionManager } from "../src/repository/Postgr sql/ConnectionManager";
import { DBException, RepositoryInitializationException } from "../src/util/exceptions/RepoException";
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
describe('BookRepo.init()', () => {

    it('should initialize successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});

        const repo = new BookRep();
        await repo.init();

        expect(ConnectionManager.getConnection).toHaveBeenCalledTimes(1);
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it('should throw if getConnection fails', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockRejectedValueOnce(new Error("DB Down"));

        const repo = new BookRep();

        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);
        expect(mockConnection.release).not.toHaveBeenCalled();
    });

    
});
describe('BookRepo.create()',()=>{

    it('should insert  the data successfully',async()=>{
          (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new BookRep();
        const mockBook:any={
            getId:()=> '1',
             getTitle:()=>'title',
             getAuthor:()=> 'author',
             getGenre:()=> 'genre',
                getFormat:()=> 'format',
                getLanguage:()=> 'language',
            getPublisher:()=> 'publisher',
            getEdition:()=> 'edition',
            getPackaging:()=> 'packaging',
            getCategory:()=> 'category'

        };
        const id= await repo.create (mockBook);
        expect(id).toBe('1');
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    })
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Insert Failed"));
        const repo = new BookRep();
        const mockBook:any={
            getId:()=> '1',
             getTitle:()=>'title',
             getAuthor:()=> 'author',
             getGenre:()=> 'genre',
                getFormat:()=> 'format',
                getLanguage:()=> 'language',
            getPublisher:()=> 'publisher',
            getEdition:()=> 'edition',
            getPackaging:()=> 'packaging',
            getCategory:()=> 'category'

        };
        await expect( repo.create (mockBook)).rejects.toThrow(DBException);
        expect( mockConnection.release).toHaveBeenCalledTimes(1);
    });


})
describe('BookRep.getALL()', () => {

    it('should retrieve all data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);

        const mockDbResult = {
            rows: [
                {
                    id:'3',
                    title:'aa',
                    author:'ali',
                    genre:'kk',
                    format:'mm',
                    language:'english',
                    publisher:'hussien',
                    edition:'22',
                    packaging:'good'
                },
                {
                       id:'4',
                    title:'aa',
                    author:'ali',
                    genre:'kk',
                    format:'mm',
                    language:'english',
                    publisher:'hussien',
                    edition:'22',
                    packaging:'good'
                },
                
            ]
        };
        mockConnection.query.mockResolvedValueOnce(mockDbResult);

        const repo = new BookRep();
        const cakes = await repo.getALL();
        expect(cakes.length).toBe(2);
        expect(cakes[0].getId()).toBe('3');
        expect(cakes[1].getId()).toBe('4');
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
})
    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Select All Failed"));
        const repo = new BookRep();
        await expect(repo.getALL()).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
    
})
describe('BookRep.deleteById()', () => {

    it('should delete data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new BookRep();
        await repo.delete('1');
        expect( mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it('should throw DBException if query fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Delete Failed"));
        const repo = new BookRep();
        await expect(repo.delete('1')).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
describe('BookRep.update()', () => {

    it('should update the book successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const mockBook: any = {
            getId: () => '1',
            getTitle: () => 'title',
            getAuthor: () => 'author',
            getGenre: () => 'genre',
            getFormat: () => 'format',
            getLanguage: () => 'language',
            getPublisher: () => 'publisher',
            getEdition: () => 'edition',
            getPackaging: () => 'packaging'
        };  
        const repo = new BookRep();
        await repo.update(mockBook);
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });
    it('should throw DBException if update fails and still release', async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockResolvedValue(mockConnection);

        mockConnection.query.mockRejectedValueOnce(new Error("Update Failed"));
        const mockBook: any = {
            getId: () => '1',
            getTitle: () => 'title',
            getAuthor: () => 'author',      
            getGenre: () => 'genre',
            getFormat: () => 'format',
            getLanguage: () => 'language',
            getPublisher: () => 'publisher',
            getEdition: () => 'edition',
            getPackaging: () => 'packaging'
        };  
        const repo = new BookRep();
        await expect(repo.update(mockBook)).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});