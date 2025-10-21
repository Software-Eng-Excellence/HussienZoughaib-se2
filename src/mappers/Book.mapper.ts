import { Book } from "../models/Book.model";
import { IMapper } from "./IMapper";
import { BookBuilder } from "../models/builder/Book.builder";

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
}