export interface IDatabaseProvider {
  findAll: <T>(table: string) => T[];
  findOneByField: <T>(table: string, field: string, value: string) => T;
  insertOne: <T>(table: string, data: T) => void;
}
