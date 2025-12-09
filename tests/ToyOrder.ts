import { ToyOrderRepo } from '../src/repository/Postgr sql/ToyOrder.Repo';
import { ConnectionManager } from '../src/repository/Postgr sql/ConnectionManager';
import { DBException, ItemNotFoundException, RepositoryInitializationException } from '../src/util/exceptions/RepoException';

jest.mock("../src/util/logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

jest.mock('../src/repository/Postgr sql/ConnectionManager', () => ({
    ConnectionManager: {
        getConnection: jest.fn()
    }
}));

let mockConnection: any;

beforeAll(() => {
    mockConnection = {
        query: jest.fn(),
        release: jest.fn()
    };
});

beforeEach(() => {
    jest.clearAllMocks();
});


describe("ToyOrderRepo.init()", () => {

    it("should initialize successfully", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});

        const repo = new ToyOrderRepo();
        await repo.init();

        expect(ConnectionManager.getConnection).toHaveBeenCalledTimes(1);
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });

    it("should throw if getConnection fails", async () => {
        (ConnectionManager.getConnection as jest.Mock)
            .mockRejectedValueOnce(new Error("DB Down"));

        const repo = new ToyOrderRepo();

        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);
        expect(mockConnection.release).not.toHaveBeenCalled();
    });

    it("should throw if query fails and still release", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Bad SQL"));

        const repo = new ToyOrderRepo();
        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);

        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});


/* ---------------------- CREATE TESTS ----------------------- */
describe("ToyOrderRepo.create()", () => {

    it("should insert the toy successfully", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});

        const mockToy: any = {
            getId: () => "1",
            getType: () => "car",
            getAgeGroup: () => 5,
            getBrand: () => "HotWheels",
            getMaterial: () => "Plastic",
            isBatteriesRequired: () => false,
            isEducational: () => true
        };

        const repo = new ToyOrderRepo();
        const id = await repo.create(mockToy);

        expect(id).toBe("1");
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw DBException if query fails and still release", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Insert Failed"));

        const mockToy: any = {
            getId: () => "1",
            getType: () => "car",
            getAgeGroup: () => 5,
            getBrand: () => "HotWheels",
            getMaterial: () => "Plastic",
            isBatteriesRequired: () => false,
            isEducational: () => true
        };

        const repo = new ToyOrderRepo();
        await expect(repo.create(mockToy)).rejects.toThrow(DBException);

        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});


/* ---------------------- GET TESTS ----------------------- */
describe("ToyOrderRepo.get()", () => {

    it("should retrieve the toy successfully", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        const mockResult = {
            rows: [{
                id: "1",
                type: "car",
                ageGroup: 5,
                brand: "HotWheels",
                material: "Plastic",
                batteriesRequired: false,
                educational: true
            }]
        };
        mockConnection.query.mockResolvedValueOnce(mockResult);

        const repo = new ToyOrderRepo();
        const toy = await repo.get("1");

        expect(toy.getId()).toBe("1");
        expect(toy.getType()).toBe("car");
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

   
    it("should throw DBException if query fails and still release", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        mockConnection.query.mockRejectedValueOnce(new Error("Select Failed"));

        const repo = new ToyOrderRepo();
        await expect(repo.get("1")).rejects.toThrow(DBException);

        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});


/* ---------------------- GET ALL TESTS ----------------------- */
describe("ToyOrderRepo.getALL()", () => {

    it("should retrieve all toys successfully", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        const mockResult = {
            rows: [
                {
                    id: "1",
                    type: "car",
                    ageGroup: 5,
                    brand: "HotWheels",
                    material: "Plastic",
                    batteriesRequired: false,
                    educational: true
                },
                {
                    id: "2",
                    type: "doll",
                    ageGroup: 7,
                    brand: "Barbie",
                    material: "Plastic",
                    batteriesRequired: false,
                    educational: false
                }
            ]
        };

        mockConnection.query.mockResolvedValueOnce(mockResult);

        const repo = new ToyOrderRepo();
        const toys = await repo.getALL();

        expect(toys.length).toBe(2);
        expect(toys[0].getId()).toBe("1");
        expect(toys[1].getId()).toBe("2");
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw DBException if query fails and still release", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        mockConnection.query.mockRejectedValueOnce(new Error("Select All Failed"));

        const repo = new ToyOrderRepo();
        await expect(repo.getALL()).rejects.toThrow(DBException);

        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});


/* ---------------------- UPDATE TESTS ----------------------- */
describe("ToyOrderRepo.update()", () => {

    it("should update the toy successfully", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        mockConnection.query.mockResolvedValueOnce({});

        const mockToy: any = {
            getId: () => "1",
            getType: () => "car",
            getAgeGroup: () => 5,
            getBrand: () => "HotWheels",
            getMaterial: () => "Plastic",
            isBatteriesRequired: () => false,
            isEducational: () => true
        };

        const repo = new ToyOrderRepo();
        await repo.update(mockToy);

        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw DBException if update fails and still release", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        mockConnection.query.mockRejectedValueOnce(new Error("Update Failed"));

        const mockToy: any = {
            getId: () => "1",
            getType: () => "car",
            getAgeGroup: () => 5,
            getBrand: () => "HotWheels",
            getMaterial: () => "Plastic",
            isBatteriesRequired: () => false,
            isEducational: () => true
        };

        const repo = new ToyOrderRepo();
        await expect(repo.update(mockToy)).rejects.toThrow(DBException);

        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});


/* ---------------------- DELETE TESTS ----------------------- */
describe("ToyOrderRepo.delete()", () => {

    it("should delete the toy successfully", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        mockConnection.query.mockResolvedValueOnce({});

        const repo = new ToyOrderRepo();
        await repo.delete("1");

        expect(mockConnection.query).toHaveBeenCalledTimes(1);
    });

    it("should throw DBException if delete fails and still release", async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);

        mockConnection.query.mockRejectedValueOnce(new Error("Delete Failed"));

        const repo = new ToyOrderRepo();
        await expect(repo.delete("1")).rejects.toThrow(DBException);

        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
