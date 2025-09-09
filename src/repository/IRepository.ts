export interface ID {
    getId(): string;
}
export interface IRepository<T> {
      /**
     * Create a new item.
     *
    
     * @template T- type of item managed by the repository
     * @throws ItemInvalidException if the provided item fails validation
     */
    
    create(item: T): Promise<ID>;
    /**
     * Retrieve an item by id.
     *
     * @param id - item identifier
     * @returns Promise resolving to the found item
     * @throws ItemNotFoundException if no item exists with the given id
     */
    get(id:ID):Promise<T>;
     /**
     * Retrieve all items.
     *
     * @returns Promise resolving to an array of items (empty array if none)
     */
    getALL():Promise<T[]>;
 /**
     * Update an existing item.
     *
     * @param item - item to update
     * @returns Promise resolved when the update completes
     * @throws ItemInvalidException if the provided item fails validation
     * @throws ItemNotFoundException if the item to update does not exist
     */
    update(item:T):Promise<void>;
  
    /**
     * Delete an item by id.
     *
     * @param id - item identifier
     * @returns Promise resolved when the deletion completes
     * @throws ItemNotFoundException if no item exists with the given id
     */
    delete(id:ID):Promise<void>;
}