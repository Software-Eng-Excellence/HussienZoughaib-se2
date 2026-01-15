/**
 * ✅ MOCKS FIRST — VERY IMPORTANT
 */

// ---- MOCK CAKE MAPPERS ----
jest.mock("../src/mappers/Cake.mapper", () => ({
  SQLITCAKEMAPPER: jest.fn().mockImplementation(() => ({})),
  CSVCakeMapper: jest.fn().mockImplementation(() => ({})),
}));

// ---- MOCK BOOK MAPPERS ----
jest.mock("../src/mappers/Book.mapper", () => ({
  SQLBOOKMAPPER: jest.fn().mockImplementation(() => ({})),
  BookMapper: jest.fn().mockImplementation(() => ({})),
}));

// ---- MOCK TOY MAPPERS ----
jest.mock("../src/mappers/Toy.mapper", () => ({
  SQLTOYMAPPER: jest.fn().mockImplementation(() => ({})),
  ToyMapper: jest.fn().mockImplementation(() => ({})),
}));

// ✅ NOW import real factory + enums
import { MapperFactory, MapperType } from "../src/mappers/Mapper.factory";
import { ItemCategory } from "../src/models/Iitem";

describe("MapperFactory", () => {

  // ---------- SQL ----------
  it("should create SQL Cake mapper", async () => {
    const mapper = await MapperFactory.create(MapperType.SQL, ItemCategory.Cake);
    expect(mapper).toBeDefined();
  });

  it("should create SQL Book mapper", async () => {
    const mapper = await MapperFactory.create(MapperType.SQL, ItemCategory.Book);
    expect(mapper).toBeDefined();
  });

  it("should create SQL Toy mapper", async () => {
    const mapper = await MapperFactory.create(MapperType.SQL, ItemCategory.Toy);
    expect(mapper).toBeDefined();
  });

  // ---------- FILE ----------
  it("should create FILE Cake mapper", async () => {
    const mapper = await MapperFactory.create(MapperType.FILE, ItemCategory.Cake);
    expect(mapper).toBeDefined();
  });

  it("should create FILE Book mapper", async () => {
    const mapper = await MapperFactory.create(MapperType.FILE, ItemCategory.Book);
    expect(mapper).toBeDefined();
  });

  it("should create FILE Toy mapper", async () => {
    const mapper = await MapperFactory.create(MapperType.FILE, ItemCategory.Toy);
    expect(mapper).toBeDefined();
  });

  // ---------- ERRORS ----------
  it("should throw error for unsupported SQL category", async () => {
    await expect(
      MapperFactory.create(MapperType.SQL, "xx" as ItemCategory)
    ).rejects.toThrow("Unsupported category for SQL mapper");
  });

  it("should throw error for unsupported FILE category", async () => {
    await expect(
      MapperFactory.create(MapperType.FILE, "yy" as ItemCategory)
    ).rejects.toThrow("Unsupported category for FILE mapper");
  });

});
