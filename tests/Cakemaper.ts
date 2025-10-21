import {CSVCakeMapper} from "../src/mappers/Cake.mapper";
import { CakeBuilder } from "../src/models/builder/Cake.builder";
import { Cake } from "../src/models/Cake.model";


describe('CSVCakeMapper',()=>{
    it('should map CSV string array to Cake object',()=>{
        const mapper=new CSVCakeMapper();
        const input=['1','Birthday','Chocolate','Vanilla','8','2','Buttercream','Chocolate','Sprinkles','Multi-color','Happy Birthday!','Round','Nuts','None','Box'];
        const cake=mapper.map(input);
        expect(cake).toBeInstanceOf(Cake);
    });
    it('should use  CakeBuilder to create Cake object',()=>{
           //arrange
           //arrange the data
              const input=['1','Wedding','Red Velvet','Cream Cheese','10','3','Fondant','Vanilla','Flowers','White','Congratulations!','Heart','Gluten','None','Box'];
             const spyBuild=jest.spyOn(CakeBuilder,'createBuilder');
             //act
                const mapper=new CSVCakeMapper();
                const cake=mapper.map(input);
                //assert
                expect(spyBuild).toHaveBeenCalled();
                expect(cake).toBeInstanceOf(Cake); 

    });
    it('should correctly map all properties from input array to Cake object',()=>{
        const mapper=new CSVCakeMapper();
        const input=['1','Anniversary','Vanilla','Strawberry','6','1','Whipped Cream','Strawberry','Hearts','Pink','Happy Anniversary!','Square','Dairy','None','Box'];
        const cake=mapper.map(input);
        expect(cake.getType()).toBe('Anniversary');
        expect(cake.getFlavor()).toBe('Vanilla');
        expect(cake.getFilling()).toBe('Strawberry');
        expect(cake.getSize()).toBe(6);
        expect(cake.getLayer()).toBe(1);
        expect(cake.getFrostingType()).toBe('Whipped Cream');
        expect(cake.getFrostingFlavor()).toBe('Strawberry');
        expect(cake.getDecType()).toBe('Hearts');
        expect(cake.getDecColor()).toBe('Pink');
        expect(cake.getCustomMessage()).toBe('Happy Anniversary!');
        expect(cake.getShape()).toBe('Square');
        expect(cake.getAllergies()).toBe('Dairy');
        expect(cake. getSpecialIngredients()).toBe('None');
        expect(cake.getPackageType()).toBe('Box');
    })
   it('should call build method correctly', () => {
    // Arrange
    const input = [
      '1','Graduation','Lemon','Raspberry','9','2',
      'Cream Cheese','Lemon','Stars','Yellow',
      'Congrats Grad!','Rectangle','Eggs','None','Box'
    ];
        const cake = new Cake(
      'Graduation','Lemon','Raspberry',9,2,
      'Cream Cheese','Lemon','Stars','Yellow',
      'Congrats Grad!','Rectangle','Eggs','None','Box'
    );

    // 🔹 Mock a builder with all needed chainable methods
    const mockBuilder = {
      setType: jest.fn().mockReturnThis(),
      setFlavor: jest.fn().mockReturnThis(),
      setFilling: jest.fn().mockReturnThis(),
      setSize: jest.fn().mockReturnThis(),
      setLayer: jest.fn().mockReturnThis(),
      setFrostingType: jest.fn().mockReturnThis(),
      setFrostingFlavor: jest.fn().mockReturnThis(),
      setDecType: jest.fn().mockReturnThis(),
      setDecColor: jest.fn().mockReturnThis(),
      setCustomMessage: jest.fn().mockReturnThis(),
      setShape: jest.fn().mockReturnThis(),
      setAllergies: jest.fn().mockReturnThis(),
      setSpIng: jest.fn().mockReturnThis(),
      setPackageType: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue(cake)
    };

    // 🔹 Replace the real builder with our mock
    const spyCreateBuilder = jest
      .spyOn(CakeBuilder, 'createBuilder')
      .mockReturnValue(mockBuilder as any);

    // Act
    const mapper = new CSVCakeMapper();
    const cakes = mapper.map(input);

    // Assert
    expect(mockBuilder.build).toHaveBeenCalled(); // ✅ this works now
    expect(cakes).toBeInstanceOf(Cake);

    // Cleanup
    spyCreateBuilder.mockRestore();
  });

});

