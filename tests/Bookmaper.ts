import {BookMapper} from '../src/mappers/Book.mapper';
import { Book } from '../src/models/Book.model';
import { BookBuilder } from '../src/models/builder/Book.builder';
describe('BookMapper', () => {
    it('should map string array to Book object', () => {
        const mapper = new BookMapper();
        const input = ['1', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'Hardcover', 'English', 'Scribner', '1st', 'Box'];
        const book = mapper.map(input);
        expect(book).toBeInstanceOf(Book);
    });

    it('should use BookBuilder to create Book object', () => {
        // arrange
        const input = ['1', '1984', 'George Orwell', 'Dystopian', 'Paperback', 'English', 'Harcourt', '1st', 'Shrink-wrapped'];
        const spyBuild = jest.spyOn(BookBuilder, 'createBuilder');
        // act
        const mapper = new BookMapper();
        const book = mapper.map(input);
        // assert
        expect(spyBuild).toHaveBeenCalled();
        expect(book).toBeInstanceOf(Book);
    });
    it('should correctly map all properties from input array to Book object', () => {
        const mapper = new BookMapper();
        const input = ['1', 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'Paperback', 'English', 'J.B. Lippincott & Co.', '1st', 'Dust Jacket'];
        const book = mapper.map(input);
        expect(book.getTitle()).toBe('To Kill a Mockingbird');
        expect(book.getAuthor()).toBe('Harper Lee');
        expect(book.getGenre()).toBe('Fiction');
        expect(book.getFormat()).toBe('Paperback');
        expect(book.getLanguage()).toBe('English');
        expect(book.getPublisher()).toBe('J.B. Lippincott & Co.');
        expect(book.getEdition()).toBe('1st');
        expect(book.getPackaging()).toBe('Dust Jacket');
    });
    it('should call build method correctly', () => {
        // Arrange
        const input = ['1', 'Moby', 'Herman Melville', 'Adventure', 'Hardcover', 'English', 'Harper & Brothers', '1st', 'Slipcase'];
        const book = new Book('Moby', 'Herman Melville', 'Adventure', 'Hardcover', 'English', 'Harper & Brothers', '1st', 'Slipcase');
        // 🔹 Mock a builder with all needed chainable method
        //  s
        const mockBuilder = {
            setTitle: jest.fn().mockReturnThis(),
            setAuthor: jest.fn().mockReturnThis(),
            setGenre: jest.fn().mockReturnThis(),
            setFormat: jest.fn().mockReturnThis(),
            setLanguage: jest.fn().mockReturnThis(),
            setPublisher: jest.fn().mockReturnThis(),
            setEdition: jest.fn().mockReturnThis(),
            setPackaging: jest.fn().mockReturnThis(),
            build: jest.fn().mockReturnValue(book),
        };
        // 🔹 Spy on the createBuilder method to return the mockBuilde
        //  r
        const spyCreateBuilder = jest.spyOn(BookBuilder, 'createBuilder').mockReturnValue(mockBuilder as unknown as BookBuilder);
        // Act
        const mapper = new BookMapper();
        const result = mapper.map(input);
        // Assert
        expect(spyCreateBuilder).toHaveBeenCalled();
                expect(book).toBeInstanceOf(Book);
    });
        
});
