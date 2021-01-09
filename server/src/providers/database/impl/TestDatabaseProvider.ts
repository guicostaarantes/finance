import {
  ICondition,
  IDatabaseProvider,
} from "@/providers/database/IDatabaseProvider";

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

  findOne(table: string, conditions: ICondition[]) {
    if (!this.database[table]) {
      throw new Error("table does not exist");
    }

    return this.database[table].find(rec =>
      conditions.every(con => {
        switch (con.compare) {
          case "=":
            return rec[con.field] == con.value;
          case "<>":
            return rec[con.field] != con.value;
          case ">":
            return rec[con.field] > con.value;
          case ">=":
            return rec[con.field] >= con.value;
          case "<":
            return rec[con.field] < con.value;
          case "<=":
            return rec[con.field] <= con.value;
        }
      }),
    );
  }

  insertOne<T>(table: string, data: T) {
    if (!this.database[table]) {
      throw new Error("table does not exist");
    }

    this.database[table].push(data);
  }

  updateOne<T>(table: string, conditions: ICondition[], data: T) {
    const index = this.database[table].findIndex(rec =>
      conditions.every(con => {
        switch (con.compare) {
          case "=":
            return rec[con.field] == con.value;
          case "<>":
            return rec[con.field] != con.value;
          case ">":
            return rec[con.field] > con.value;
          case ">=":
            return rec[con.field] >= con.value;
          case "<":
            return rec[con.field] < con.value;
          case "<=":
            return rec[con.field] <= con.value;
        }
      }),
    );

    if (index >= 0) {
      this.database[table][index] = { ...this.database[table][index], ...data };
    }
  }
}

export default TestDatabaseProvider;
