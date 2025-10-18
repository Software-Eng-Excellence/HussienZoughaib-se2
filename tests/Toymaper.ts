import { ToyMapper } from "../src/mappers/Toy.mapper";
import { Toy } from "../src/models/Toy.model";

describe("ToyMapper", () => {
  it("maps CSV row to Toy instance with correct properties", () => {
    const mapper = new ToyMapper();
    const input = ["0", "Action Figure", "8", "Hasbro", "Plastic", "true", "false"];
    const toy = mapper.map(input);

    expect(toy).toBeInstanceOf(Toy);
    expect(toy.getType()).toBe("Action Figure");
    expect(toy.getAgeGroup()).toBe(8);
    expect(toy.getBrand()).toBe("Hasbro");
    expect(toy.getMaterial()).toBe("Plastic");
    expect(toy.isBatteriesRequired()).toBe(true);
    expect(toy.isEducational()).toBe(false);
  });

  it("parses boolean values case-insensitively", () => {
    const mapper = new ToyMapper();
    const input = ["1", "Puzzle", "3", "Ravensburger", "Cardboard", "True", "FALSE"];
    const toy = mapper.map(input);

    expect(toy.isBatteriesRequired()).toBe(true);
    expect(toy.isEducational()).toBe(false);
  });

  it("parses numeric ageGroup from string input", () => {
    const mapper = new ToyMapper();
    const input = ["2", "Building Set", "10", "LEGO", "Plastic", "false", "true"];
    const toy = mapper.map(input);

    expect(toy.getAgeGroup()).toBe(10);
  });
});