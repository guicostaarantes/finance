import { IDatabaseProvider } from "../IDatabaseProvider";

class TestDatabaseProvider implements IDatabaseProvider {
  database: Record<string, any[]>;

  constructor() {
    this.database = {};
  }

  findAll(table: string) {
    if (!this.database[table]) {
      throw new Error("table does not exist");
    }

    return this.database[table];
  }

  findOneByField(table: string, field: string, value: string) {
    if (!this.database[table]) {
      throw new Error("table does not exist");
    }

    return this.database[table].find(rec => rec[field] === value);
  }

  insertOne(table: string, data: unknown) {
    if (!this.database[table]) {
      throw new Error("table does not exist");
    }

    this.database[table].push(data);
  }
}

export default TestDatabaseProvider;
