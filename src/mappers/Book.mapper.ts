import { Book, INITBook } from "../models/Book.model";
import { IMapper } from "./IMapper";
import { BookBuilder, IDENBookBuilder } from "../models/builder/Book.builder";

export class BookMapper implements IMapper<string[], Book> {
    map(input: string[]): Book {
        return BookBuilder.createBuilder()
            .setTitle(input[1])
            .setAuthor(input[2])
            .setGenre(input[3])
            .setFormat(input[4])
            .setLanguage(input[5])
            .setPublisher(input[6])
            .setEdition(input[7])
            .setPackaging(input[8])
            .build();

    }
    reversemap(input: Book): string[] {
        return [
            input.getTitle(),
            input.getAuthor(),
            input.getGenre(),
            input.getFormat(),
            input.getLanguage(),
            input.getPublisher(),
            input.getEdition(),
            input.getPackaging()
        ];
    }
}
export interface  SQLBOOK{
      id:string,
          title: string,
        author: string,
        genre: string,
        format: string,
        language: string,
        publisher: string,
        edition: string,
        packaging: string   
}
export class SQLBOOKMAPPER implements IMapper<SQLBOOK,INITBook>{
    map(input: SQLBOOK): INITBook {
     return IDENBookBuilder.createBuilder().setBook(
        BookBuilder.createBuilder().setTitle(input.title)
        .setAuthor(input.author)
        .setGenre(input.genre)  
        .setFormat(input.language)
        .setLanguage(input.language)
        .setPublisher(input.publisher)
        .setEdition(input.edition)
        .setPackaging(input.packaging)
        .build()
     ).setId(input.id).build();
    }
    reversemap(input: INITBook): SQLBOOK {
        return {
            id: input.getId(),
            title: input.getTitle(),
            author: input.getAuthor(),
            genre: input.getGenre(),
            format: input.getFormat(),
            language: input.getLanguage(),
            publisher: input.getPublisher(),
            edition: input.getEdition(),
            packaging: input.getPackaging()
        };
    }

}