import { INITBook } from "../../models/Book.model";
import { ItemCategory } from "../../models/Iitem";
import { id, Intiazable, IRepository } from "../../repository/IRepository";
import { ConnectionManager } from "./ConnectionManager";
import { DBException, ItemNotFoundException, RepositoryInitializationException } from "../../util/exceptions/RepoException";
import logger from "../../util/logger";
import { Sqlbook, SQLBOOKMAPPER } from "../../mappers/Book.mapper";

const table_name=ItemCategory.Book; 
 
const CREATE_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS ${table_name} (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
   author TEXT NOT NULL,
     genre TEXT NOT NULL,
    format TEXT NOT NULL,
   language TEXT NOT NULL,
     publisher TEXT NOT NULL,
      edition TEXT NOT NULL,
       packaging TEXT NOT NULL
)
`;
const Insert_BOOk_QUERY = `
INSERT INTO ${table_name} 
(id,  title, author, genre, format, language, publisher , edition , packaging )
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);
`;
const GET_BOOK_BY_ID=`SELECT * FROM ${table_name} WHERE id=$1;`

const Get_BOOK=`SELECT * FROM ${table_name}`;
const UPDATE_BOOK_BYID = `
UPDATE ${table_name}
SET
    title = $1,
    author = $2,
    genre = $3,
    format = $4,
    language = $5,
    publisher = $6,
    edition = $7,
    packaging = $8
WHERE id = $9;
`;

const DELTE_BOOK_BYID = `
DELETE FROM ${table_name}
WHERE id = $1;
`;


export class BookRep implements IRepository<INITBook>, Intiazable {

    async init(): Promise<void> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();
            await connection.query(CREATE_TABLE_QUERY);
            logger.info("book table ensured in the database");
        } catch (error) {
            logger.error("Failed to initialize the repository", error as Error);
            throw new RepositoryInitializationException(
                "Failed to initialize the repository",
                error as Error
            );
        } finally {
            if (connection) connection.release();
        }
    }

    async create(item: INITBook): Promise<id> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();

            await connection.query(Insert_BOOk_QUERY, [
                item.getId(),
                item.getTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getEdition(),
                item.getPackaging()
            ]);

            logger.info(`Book created with id ${item.getId()}`);
            return item.getId();

        } catch (error) {
            logger.error("Failed to create book", error as Error);
            throw new DBException("Failed to create book", error as Error);

        } finally {
            if (connection) connection.release();
        }
    }

    async get(id: id): Promise<INITBook> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();

            const result = await connection.query<Sqlbook>(GET_BOOK_BY_ID, [id]);
            const target = result.rows[0];

            if (!target) {
                logger.info("book not found");
                throw new ItemNotFoundException("book not found");
            }

            return new SQLBOOKMAPPER().map(target);

        } catch (error) {
            logger.error(error);
            throw new DBException("failed to fetch book", error as Error);

        } finally {
            if (connection) connection.release();
        }
    }

    async getALL(): Promise<INITBook[]> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();

            const result = await connection.query<Sqlbook>(Get_BOOK);
            const mapper = new SQLBOOKMAPPER();

            return result.rows.map(row => mapper.map(row));

        } catch (error) {
            logger.error(error);
            throw new DBException("cannot fetch books", error as Error);

        } finally {
            if (connection) connection.release();
        }
    }

    async update(item: INITBook): Promise<void> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();

            const result = await connection.query(UPDATE_BOOK_BYID, [
                item.getTitle(),
                item.getAuthor(),
                item.getGenre(),
                item.getFormat(),
                item.getLanguage(),
                item.getPublisher(),
                item.getEdition(),
                item.getPackaging(),
                item.getId()
            ]);

            if (result.rowCount === 0) {
                throw new ItemNotFoundException("book not found");
            }

            logger.info(`Book updated with id ${item.getId()}`);

        } catch (error) {
            logger.error(error);
            throw new DBException("failed to update book", error as Error);

        } finally {
            if (connection) connection.release();
        }
    }

    async delete(id: id): Promise<void> {
        let connection;
        try {
            connection = await ConnectionManager.getConnection();

            const result = await connection.query(DELTE_BOOK_BYID, [id]);

            if (result.rowCount === 0) {
                throw new ItemNotFoundException("book not found");
            }

            logger.info(`Book deleted with id ${id}`);

        } catch (error) {
            logger.error(error);
            throw new DBException("failed to delete book", error as Error);

        } finally {
            if (connection) connection.release();
        }
    }
}
