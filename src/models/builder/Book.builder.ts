import { Book } from "../Book.model";
import loggger from "../../util/logger";
export class BookBuilder {
  private title!: string;
  private author!: string;
  private genre!: string;
  private format!: string;
  private language!: string;
  private publisher!: string;
  private edition!: string;
  private packaging!: string;

  setTitle(title: string): BookBuilder {
    this.title = title;
    return this;
  }

  setAuthor(author: string): BookBuilder {
    this.author = author;
    return this;
  }

  setGenre(genre: string): BookBuilder {
    this.genre = genre;
    return this;
  }

  setFormat(format: string): BookBuilder {
    this.format = format;
    return this;
  }

  setLanguage(language: string): BookBuilder {
    this.language = language;
    return this;
  }

  setPublisher(publisher: string): BookBuilder {
    this.publisher = publisher;
    return this;
  }

  setEdition(edition: string): BookBuilder {
    this.edition = edition;
    return this;
  }

  setPackaging(packaging: string): BookBuilder {
    this.packaging = packaging;
    return this;
  }
  build():Book{
    const requiredFields = [
        this.title,
        this.author,
        this.genre, 
        this.format,
        this.language,
        this.publisher,
        this.edition,
        this.packaging
    ];
    for(const f of requiredFields){
        if(!f){
            loggger.error("Missing required field for Book");
            throw new Error("Missing required field for Book");
        }
    }
    return new Book(
        this.title,
        this.author,
        this.genre,
        this.format,
        this.language,
        this.publisher,
        this.edition,
        this.packaging
    );
  }
}
