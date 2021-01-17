import sqlite, { Database } from "better-sqlite3";

import { ICondition, IDatabaseProvider } from "@providers/database/IDatabaseProvider";

class SQLiteDatabaseProvider implements IDatabaseProvider {
  database: Database;

  constructor(file: string) {
    this.database = new sqlite(file);
  }

  findOne(table: string, conditions: ICondition[]) {
    const stmt = this.database.prepare(
      `SELECT * FROM ${table} WHERE ${conditions
        .map(
          c =>
            `${c.field} ${c.compare} ${
              typeof c.value === "string" ? `'${c.value}'` : c.value
            }`,
        )
        .join(" AND ")} LIMIT 1`,
    );
    return stmt.get();
  }

  findMany(table: string, conditions: ICondition[]) {
    const stmt = this.database.prepare(
      `SELECT * FROM ${table} WHERE ${conditions
        .map(
          c =>
            `${c.field} ${c.compare} ${
              typeof c.value === "string" ? `'${c.value}'` : c.value
            }`,
        )
        .join(" AND ")}`,
    );
    return stmt.all();
  }

  insertOne<T>(table: string, data: T) {
    const keys = Object.keys(data);
    let values = [];

    keys.forEach(k => {
      values.push(typeof data[k] === "string" ? `'${data[k]}'` : data[k]);
    });

    const stmt = this.database.prepare(
      `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(", ")})`,
    );
    return stmt.run();
  }

  updateOne<T>(table: string, conditions: ICondition[], data: T) {
    const stmt = this.database.prepare(
      `UPDATE ${table} SET ${Object.keys(data)
        .map(
          d =>
            `${d} = ${typeof data[d] === "string" ? `'${data[d]}'` : data[d]}`,
        )
        .join(", ")} WHERE ${conditions
        .map(c => `${c.field} ${c.compare} ${c.value}`)
        .join(" AND ")} LIMIT 1`,
    );
    return stmt.run();
  }

  deleteOne(table: string, conditions: ICondition[]) {
    const stmt = this.database.prepare(
      `DELETE FROM ${table} WHERE ${conditions
        .map(c => `${c.field} ${c.compare} ${c.value}`)
        .join(" AND ")} LIMIT 1`,
    );
    return stmt.run();
  }
}

export default SQLiteDatabaseProvider;
