import { OrderManagement } from '../src/service/OrderMangmnet';
import { RepositoryFactory, DBMode } from '../src/repository/Repo.factory';
import { ItemCategory } from '../src/models/Iitem';

jest.mock('../src/repository/Repo.factory');

describe('OrderManagement - groupOrdersByCategory', () => {
    let orderManagement: OrderManagement;
    let mockRepository: any;

    beforeEach(() => {
        orderManagement = new OrderManagement();
        mockRepository = {
            getALL: jest.fn(),
            create: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        (RepositoryFactory.create as jest.Mock).mockResolvedValue(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return grouped orders by category with correct total', async () => {
        // Arrange
        const mockOrders = [
            { id: '1', getQuantity: () => 2, getPrice: () => 10 },
            { id: '2', getQuantity: () => 3, getPrice: () => 15 },
        ];

        mockRepository.getALL.mockResolvedValue(mockOrders);

        // Act
        const result = await orderManagement.groupOrdersByCategory();

        // Assert
        expect(result.totalOrders).toBe(6); // 2 orders * 3 categories
        expect(result.byCategory[ItemCategory.Cake]).toBe(2);
        expect(result.byCategory[ItemCategory.Book]).toBe(2);
        expect(result.byCategory[ItemCategory.Toy]).toBe(2);
        expect(RepositoryFactory.create).toHaveBeenCalledTimes(3);
    });

    it('should handle empty categories correctly', async () => {
        // Arrange
        mockRepository.getALL.mockResolvedValue([]);

        // Act
        const result = await orderManagement.groupOrdersByCategory();

        // Assert
        expect(result.totalOrders).toBe(0);
        expect(result.byCategory[ItemCategory.Cake]).toBe(0);
        expect(result.byCategory[ItemCategory.Book]).toBe(0);
        expect(result.byCategory[ItemCategory.Toy]).toBe(0);
    });

    it('should call RepositoryFactory.create for each category', async () => {
        // Arrange
        mockRepository.getALL.mockResolvedValue([
            { id: '1' },
            { id: '2' },
        ]);

        // Act
        await orderManagement.groupOrdersByCategory();

        // Assert
        expect(RepositoryFactory.create).toHaveBeenCalledWith(DBMode.SQLITE, ItemCategory.Cake);
        expect(RepositoryFactory.create).toHaveBeenCalledWith(DBMode.SQLITE, ItemCategory.Book);
        expect(RepositoryFactory.create).toHaveBeenCalledWith(DBMode.SQLITE, ItemCategory.Toy);
        expect(RepositoryFactory.create).toHaveBeenCalledTimes(3);
    });

    it('should return structure with totalOrders and byCategory properties', async () => {
        // Arrange
        mockRepository.getALL.mockResolvedValue([{ id: '1' }]);

        // Act
        const result = await orderManagement.groupOrdersByCategory();

        // Assert
        expect(result).toHaveProperty('totalOrders');
        expect(result).toHaveProperty('byCategory');
        expect(typeof result.totalOrders).toBe('number');
        expect(typeof result.byCategory).toBe('object');
    });

    it('should correctly accumulate orders across different categories', async () => {
        // Arrange
        mockRepository.getALL
            .mockResolvedValueOnce([{ id: '1' }, { id: '2' }, { id: '3' }]) // Cake: 3 orders
            .mockResolvedValueOnce([{ id: '4' }, { id: '5' }]) // Book: 2 orders
            .mockResolvedValueOnce([{ id: '6' }]); // Toy: 1 order

        // Act
        const result = await orderManagement.groupOrdersByCategory();

        // Assert
        expect(result.totalOrders).toBe(6);
        expect(result.byCategory[ItemCategory.Cake]).toBe(3);
        expect(result.byCategory[ItemCategory.Book]).toBe(2);
        expect(result.byCategory[ItemCategory.Toy]).toBe(1);
    });
});

describe('OrderManagement - GenerateRevenueByCategory', () => {
    let orderManagement: OrderManagement;
    let mockRepository: any;

    beforeEach(() => {
        orderManagement = new OrderManagement();
        mockRepository = {
            getALL: jest.fn(),
            create: jest.fn(),
            get: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        (RepositoryFactory.create as jest.Mock).mockResolvedValue(mockRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate revenue correctly for each category', async () => {
        // Arrange
        const cakeOrders = [
            { id: '1', getQuantity: () => 2, getPrice: () => 25 },
            { id: '2', getQuantity: () => 3, getPrice: () => 30 },
        ];
        const bookOrders = [
            { id: '3', getQuantity: () => 1, getPrice: () => 15 },
        ];
        const toyOrders = [
            { id: '4', getQuantity: () => 5, getPrice: () => 10 },
        ];

        mockRepository.getALL
            .mockResolvedValueOnce(cakeOrders)
            .mockResolvedValueOnce(bookOrders)
            .mockResolvedValueOnce(toyOrders);

        // Act
        const result = await orderManagement.GenerateRevenueByCategory();

        // Assert
        // Cake: (2*25) + (3*30) = 50 + 90 = 140
        expect(result.byCategory[ItemCategory.Cake]).toBe(140);
        // Book: 1*15 = 15
        expect(result.byCategory[ItemCategory.Book]).toBe(15);
        // Toy: 5*10 = 50
        expect(result.byCategory[ItemCategory.Toy]).toBe(50);
    });

    it('should return zero revenue for empty categories', async () => {
        // Arrange
        mockRepository.getALL.mockResolvedValue([]);

        // Act
        const result = await orderManagement.GenerateRevenueByCategory();

        // Assert
        expect(result.byCategory[ItemCategory.Cake]).toBe(0);
        expect(result.byCategory[ItemCategory.Book]).toBe(0);
        expect(result.byCategory[ItemCategory.Toy]).toBe(0);
    });

    it('should call RepositoryFactory.create for each category', async () => {
        // Arrange
        mockRepository.getALL.mockResolvedValue([
            { getQuantity: () => 1, getPrice: () => 10 },
        ]);

        // Act
        await orderManagement.GenerateRevenueByCategory();

        // Assert
        expect(RepositoryFactory.create).toHaveBeenCalledWith(DBMode.SQLITE, ItemCategory.Cake);
        expect(RepositoryFactory.create).toHaveBeenCalledWith(DBMode.SQLITE, ItemCategory.Book);
        expect(RepositoryFactory.create).toHaveBeenCalledWith(DBMode.SQLITE, ItemCategory.Toy);
        expect(RepositoryFactory.create).toHaveBeenCalledTimes(3);
    });

    it('should return structure with byCategory property', async () => {
        // Arrange
        mockRepository.getALL.mockResolvedValue([]);

        // Act
        const result = await orderManagement.GenerateRevenueByCategory();

        // Assert
        expect(result).toHaveProperty('byCategory');
        expect(typeof result.byCategory).toBe('object');
        expect(Object.keys(result.byCategory)).toContain(ItemCategory.Cake);
        expect(Object.keys(result.byCategory)).toContain(ItemCategory.Book);
        expect(Object.keys(result.byCategory)).toContain(ItemCategory.Toy);
    });

    it('should handle multiple orders per category with varying prices and quantities', async () => {
        // Arrange
        const orders = [
            { id: '1', getQuantity: () => 10, getPrice: () => 50 },
            { id: '2', getQuantity: () => 5, getPrice: () => 20 },
            { id: '3', getQuantity: () => 2, getPrice: () => 100 },
        ];

        mockRepository.getALL
            .mockResolvedValueOnce(orders)
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);

        // Act
        const result = await orderManagement.GenerateRevenueByCategory();

        // Assert
        // Cake: (10*50) + (5*20) + (2*100) = 500 + 100 + 200 = 800
        expect(result.byCategory[ItemCategory.Cake]).toBe(800);
        expect(result.byCategory[ItemCategory.Book]).toBe(0);
        expect(result.byCategory[ItemCategory.Toy]).toBe(0);
    });

    it('should handle decimal prices and quantities correctly', async () => {
        // Arrange
        const orders = [
            { id: '1', getQuantity: () => 2.5, getPrice: () => 19.99 },
            { id: '2', getQuantity: () => 1.5, getPrice: () => 29.99 },
        ];

        mockRepository.getALL
            .mockResolvedValueOnce(orders)
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);

        // Act
        const result = await orderManagement.GenerateRevenueByCategory();

        // Assert
        // Cake: (2.5*19.99) + (1.5*29.99) = 49.975 + 44.985 = 94.96
        const expectedRevenue = 2.5 * 19.99 + 1.5 * 29.99;
        expect(result.byCategory[ItemCategory.Cake]).toBeCloseTo(expectedRevenue, 2);
    });

    it('should calculate total revenue across all categories correctly', async () => {
        // Arrange
        const cakeOrders = [
            { id: '1', getQuantity: () => 2, getPrice: () => 25 },
        ];
        const bookOrders = [
            { id: '2', getQuantity: () => 3, getPrice: () => 15 },
        ];
        const toyOrders = [
            { id: '3', getQuantity: () => 4, getPrice: () => 10 },
        ];

        mockRepository.getALL
            .mockResolvedValueOnce(cakeOrders)
            .mockResolvedValueOnce(bookOrders)
            .mockResolvedValueOnce(toyOrders);

        // Act
        const result = await orderManagement.GenerateRevenueByCategory();

        // Assert
        // Cake: 2*25 = 50, Book: 3*15 = 45, Toy: 4*10 = 40
        const totalRevenue = 50 + 45 + 40;
        const actualTotal = result.byCategory[ItemCategory.Cake] +
                            result.byCategory[ItemCategory.Book] +
                            result.byCategory[ItemCategory.Toy];
        expect(actualTotal).toBe(totalRevenue);
    });
});
