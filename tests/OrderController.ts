

import { Request, Response } from "express";
import { OrderController } from "../src/controller/Order.controller";
import { JsonFactorry } from "../src/mappers/index";
import { BadRequestException } from "../src/util/exceptions/http/BadRequestException";

/**
 * ✅ MOCK JsonFactorry (IMPORTED dependency)
 */
jest.mock("../src/mappers/index", () => ({
  JsonFactorry: {
    createMapper: jest.fn(),
  },
}));

/**
 * ✅ Helper: mock Express response
 */
const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe("OrderController", () => {
  let controller: OrderController;
  let orderManagement: any;

  beforeEach(() => {
    /**
     * ✅ MOCK SERVICE LAYER (INJECTED dependency)
     */
    orderManagement = {
      create: jest.fn(),
      get: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    controller = new OrderController(orderManagement);
    jest.clearAllMocks();
  });

  // ============================
  // CREATE ORDER
  // ============================
  it("should create an order successfully", async () => {
    const req = {
      body: { id: "1", category: "cake" },
    } as Request;

    const res = mockResponse();

    const fakeOrderItem = {
      getId: () => "1",
    };

    (JsonFactorry.createMapper as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(fakeOrderItem),
    });

    orderManagement.create.mockResolvedValue(fakeOrderItem);

    await controller.CreateOrder(req, res);

    expect(orderManagement.create).toHaveBeenCalledWith(fakeOrderItem);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order created successfully",
      order: fakeOrderItem,
    });
  });

  it("should throw error if order data is invalid", async () => {
    const req = {
      body: { category: "cake" },
    } as Request;

    const res = mockResponse();

    (JsonFactorry.createMapper as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(null),
    });

    await expect(controller.CreateOrder(req, res)).rejects.toThrow(
      "Invalid order data"
    );
  });

  // ============================
  // GET ORDER
  // ============================
  it("should get order by id", async () => {
    const req = {
      params: { id: "123" },
    } as unknown as Request;

    const res = mockResponse();

    const fakeOrder = {
      getItem: () => ({
        getCategory: () => "cake",
      }),
    };

    orderManagement.get.mockResolvedValue(fakeOrder);

    (JsonFactorry.createMapper as jest.Mock).mockReturnValue({
      reversemap: jest.fn().mockReturnValue({ id: "123" }),
    });

    await controller.GetOrder(req, res);

    expect(orderManagement.get).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order 123 fetched successfully",
      order: { id: "123" },
    });
  });

  it("should throw BadRequestException if id is missing", async () => {
    const req = {
      params: {},
    } as unknown as Request;

    const res = mockResponse();

    await expect(controller.GetOrder(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  // ============================
  // GET ALL ORDERS
  // ============================
  it("should get all orders", async () => {
    const req = {} as Request;
    const res = mockResponse();

    const fakeOrders = [
      {
        getItem: () => ({
          getCategory: () => "cake",
        }),
      },
    ];

    orderManagement.getAll.mockResolvedValue(fakeOrders);

    (JsonFactorry.createMapper as jest.Mock).mockReturnValue({
      reversemap: jest.fn().mockReturnValue({ id: "1" }),
    });

    await controller.GetAllOrders(req, res);

    expect(orderManagement.getAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Orders fetched successfully",
      orders: [{ id: "1" }],
    });
  });

  // ============================
  // UPDATE ORDER
  // ============================
  it("should update order successfully", async () => {
    const req = {
      params: { id: "1" },
      body: { id: "1", category: "cake" },
    } as unknown as Request;

    const res = mockResponse();

    const fakeOrderItem = {
      getId: () => "1",
    };

    (JsonFactorry.createMapper as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(fakeOrderItem),
    });

    orderManagement.update.mockResolvedValue(fakeOrderItem);

    await controller.UpdateOrder(req, res);

    expect(orderManagement.update).toHaveBeenCalledWith(fakeOrderItem);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should throw if body id != param id", async () => {
    const req = {
      params: { id: "1" },
      body: { id: "2", category: "cake" },
    } as unknown as Request;

    const res = mockResponse();

    const fakeOrderItem = {
      getId: () => "2",
    };

    (JsonFactorry.createMapper as jest.Mock).mockReturnValue({
      map: jest.fn().mockReturnValue(fakeOrderItem),
    });

    await expect(controller.UpdateOrder(req, res)).rejects.toBeInstanceOf(
      BadRequestException
    );
  });

  // ============================
  // DELETE ORDER
  // ============================
  it("should delete order successfully", async () => {
    const req = {
      params: { id: "1" },
    } as unknown as Request;

    const res = mockResponse();

    orderManagement.delete.mockResolvedValue(undefined);

    await controller.DeletOrder(req, res);

    expect(orderManagement.delete).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Order 1 deleted successfully",
    });
  });
});
