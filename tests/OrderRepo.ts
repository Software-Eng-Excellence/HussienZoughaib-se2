import { ConnectionManager } from "../src/repository/Postgr sql/ConnectionManager";
import { Orderrep } from "../src/repository/Postgr sql/Order.Repo";
import { DBException, RepositoryInitializationException } from "../src/util/exceptions/RepoException";
import { ItemCategory } from '../src/models/Iitem';
import logger from "../src/util/logger";

// Mock logger to silence errors in tests
jest.mock(".././src/util/logger", () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

// Mock ConnectionManager
jest.mock('.././src/repository/Postgr sql/ConnectionManager', () => ({
    ConnectionManager: {
        getConnection: jest.fn()
    }
}));

let mockConnection: any;
let mockItemRepo: any;
let mockOrder: any;

beforeAll(() => {
    mockConnection = {
        query: jest.fn(),
        release: jest.fn()
    };

    mockOrder = {
        getId: () => '1',
        getPrice: () => 30,
        getQuantity: () => 5,
        getItem: () => ({
            getCategory: () => ItemCategory.Cake,
            getId: () => 'cake123'
        })
    };
});

beforeEach(() => {
    jest.clearAllMocks();

    // reusable mock itemRepo (cake repo) with init method
    mockItemRepo = {
        init: jest.fn().mockResolvedValue(undefined),
        create: jest.fn().mockResolvedValue('cake123'),
        get: jest.fn().mockResolvedValue(mockOrder.getItem()),
        getALL: jest.fn().mockResolvedValue([mockOrder.getItem()]),
        update: jest.fn(),
        delete: jest.fn(),
    };
});

// ------------------------------
// INIT
// ------------------------------
describe('OrderRepo.init()', () => {
    it('should initialize successfully and call itemRepo.init', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});

        const repo = new Orderrep(mockItemRepo);
        await repo.init();

        expect(ConnectionManager.getConnection).toHaveBeenCalledTimes(1);
        expect(mockConnection.query).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
        expect(mockItemRepo.init).toHaveBeenCalledTimes(1);
    });

    it('should throw RepositoryInitializationException if getConnection fails', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockRejectedValueOnce(new Error("DB Down"));
        const repo = new Orderrep(mockItemRepo);
        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);
    });

    it('should throw RepositoryInitializationException if query fails', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Bad SQL"));
        const repo = new Orderrep(mockItemRepo);
        await expect(repo.init()).rejects.toThrow(RepositoryInitializationException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});

// ------------------------------
// CREATE
// ------------------------------


// ------------------------------
// GET BY ID
// ------------------------------
describe('OrderRepo.get(id)', () => {
    it('should retrieve data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({ rows: [{ id: '1', price: 30, quantity: 5, item_category: 'cake', item_id: 'cake123' }] });

        const repo = new Orderrep(mockItemRepo);
        const order = await repo.get('1');

        expect(order.getId()).toBe('1');
        expect(order.getPrice()).toBe(30);
        expect(order.getQuantity()).toBe(5);
    });

    it('should throw DBException if query fails', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Select Failed"));

        const repo = new Orderrep(mockItemRepo);
        await expect(repo.get('1')).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});

// ------------------------------
// GET ALL
// ------------------------------
describe('OrderRepo.getALL()', () => {
    it('should retrieve all data successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({ 
             rows: [
        {
            id: '1',
            price: 30,
            quantity: 5,
            item_category: ItemCategory.Cake,
            item_id: 'cake123'
        }
    ]



         });

        const repo = new Orderrep(mockItemRepo);
        const orders = await repo.getALL();
        expect(orders.length).toBeGreaterThan(0);
    });

    it('should throw DBException if query fails', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Select All Failed"));
        const repo = new Orderrep(mockItemRepo);
        await expect(repo.getALL()).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});

// ------------------------------
// UPDATE
// ------------------------------
describe('OrderRepo.update()', () => {
    it('should update successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new Orderrep(mockItemRepo);
        await repo.update(mockOrder);
        expect(mockConnection.query).toHaveBeenCalledTimes(3);
    });

    it('should throw DBException if update fails', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Update Failed"));
        const repo = new Orderrep(mockItemRepo);
        await expect(repo.update(mockOrder)).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});

// ------------------------------
// DELETE
// ------------------------------
describe('OrderRepo.delete()', () => {
    it('should delete successfully', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockResolvedValueOnce({});
        const repo = new Orderrep(mockItemRepo);
        await repo.delete('1');
        expect(mockConnection.query).toHaveBeenCalledTimes(3);
    });

    it('should throw DBException if delete fails', async () => {
        (ConnectionManager.getConnection as jest.Mock).mockResolvedValue(mockConnection);
        mockConnection.query.mockRejectedValueOnce(new Error("Delete Failed"));
        const repo = new Orderrep(mockItemRepo);
        await expect(repo.delete('1')).rejects.toThrow(DBException);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
    });
});
