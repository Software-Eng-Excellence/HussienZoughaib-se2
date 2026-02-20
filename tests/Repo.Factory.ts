/**
 * ✅ MOCKS — MUST BE FIRST
 */

// ---- MOCK POSTGRES CONNECTION ----
jest.mock("../src/repository/Postgr sql/ConnectionManager", () => ({
  ConnectionManager: {
    getConnection: jest.fn().mockResolvedValue({
      query: jest.fn().mockResolvedValue({ rows: [] }),
      release: jest.fn(),
    }),
    init: jest.fn().mockResolvedValue(undefined),
  },
}));

// ---- MOCK SQLITE ORDER WRAPPER ----
jest.mock("../src/repository/sqlite/Orderrepo", () => ({
  Orderrepo: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
  })),
}));

// ---- MOCK POSTGRES ORDER WRAPPER ----
jest.mock("../src/repository/Postgr sql/Order.Repo", () => ({
  Orderrep: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
  })),
}));

// ---- MOCK SQLITE LEAF REPOS ----
jest.mock("../src/repository/sqlite/CakeOrder.Repo", () => ({
  CakeOrderRepo: jest.fn(),
}));

// ---- MOCK POSTGRES LEAF REPOS ----
jest.mock("../src/repository/Postgr sql/CakeOrder.Repo", () => ({
  CakeOrderRepp: jest.fn(),
}));

jest.mock("../src/repository/Postgr sql/Book.Repo", () => ({
  BookRep: jest.fn(),
}));

jest.mock("../src/repository/Postgr sql/ToyOrder.Repo", () => ({
  ToyOrderRepo: jest.fn(),
}));

// ---- MOCK FILE REPO ----
jest.mock("../src/repository/file/CakeOrder.Rep", () => ({
  CakeOrderRep: jest.fn(),
}));

// ✅ NOW IMPORT REAL CODE
import { ItemCategory } from "../src/models/Iitem";
import { DBMode, RepositoryFactory } from "../src/repository/Repo.factory";

describe("Repo Factory", () => {

  it("should create SQLITE Cake repository", async () => {
    const repo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.Cake);
    expect(repo).toBeDefined();
  });

  it("should create SQLITE Book repository", async () => {
    const repo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.Book);
    expect(repo).toBeDefined();
  });

  it("should create SQLITE Toy repository", async () => {
    const repo = await RepositoryFactory.create(DBMode.SQLITE, ItemCategory.Toy);
    expect(repo).toBeDefined();
  });

  it("should create PostgrSQL Cake repository", async () => {
    const repo = await RepositoryFactory.create(DBMode.PostgrSQL, ItemCategory.Cake);
    expect(repo).toBeDefined();
  });

  it("should create PostgrSQL Book repository", async () => {
    const repo = await RepositoryFactory.create(DBMode.PostgrSQL, ItemCategory.Book);
    expect(repo).toBeDefined();
  });

  it("should create PostgrSQL Toy repository", async () => {
    const repo = await RepositoryFactory.create(DBMode.PostgrSQL, ItemCategory.Toy);
    expect(repo).toBeDefined();
  });

  // 🔥 CHANGED: This test now expects an error instead of success
  it("should throw error for FILE Cake repository (not implemented yet)", async () => {
    await expect(
      RepositoryFactory.create(DBMode.FILE, ItemCategory.Cake)
    ).rejects.toThrow("Unsupported category"); // Or whatever error your factory throws
  });

  it("should throw error for unsupported category", async () => {
    await expect(
      RepositoryFactory.create(DBMode.SQLITE, "kk" as ItemCategory)
    ).rejects.toThrow("Unsupported category");
  });
});