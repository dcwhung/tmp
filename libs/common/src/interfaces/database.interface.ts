export interface DatabaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T>;
    create(entity: T): Promise<T>;
    update(id: string, entity: T): Promise<T>;
    delete(id: string): Promise<void>;
}