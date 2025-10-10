import { Item, ItemCategory } from "./item.model";

export class Book implements Item {
    private title: string;
    private author: string;
    private genre: string;
    private format: string;
    private language: string;
    private publisher: string;
    private edition: string;
    private packaging: string;

    constructor(
        title: string,
        author: string,
        genre: string,
        format: string,
        language: string,
        publisher: string,
        edition: string,
        packaging: string
    ) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.format = format;
        this.language = language;
        this.publisher = publisher;
        this.edition = edition;
        this.packaging = packaging;
    }

    // Getters
    getTitle(): string {
        return this.title;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenre(): string {
        return this.genre;
    }

    getFormat(): string {
        return this.format;
    }

    getLanguage(): string {
        return this.language;
    }

    getPublisher(): string {
        return this.publisher;
    }

    getEdition(): string {
        return this.edition;
    }

    getPackaging(): string {
        return this.packaging;
    }

    // Category
    getCategory(): ItemCategory {
        return ItemCategory.Book;
    }
}
