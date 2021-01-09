import sqlite, { Database } from "better-sqlite3";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";

class SQLiteDatabaseProvider implements IDatabaseProvider {
  database: Database;

  constructor(file: string) {
    this.database = new sqlite(file);
  }

  findAll(table: string) {
    try {
      const stmt = this.database.prepare(`SELECT * FROM ${table}`);
      return stmt.all();
    } catch (err) {
      if (err.message === `no such table: ${table}`) {
        throw new Error("table does not exist");
      } else {
        console.error(err);
      }
    }
  }

  findOneByField(table: string, field: string, value: string) {
    try {
      const stmt = this.database.prepare<string>(
        `SELECT * FROM ${table} WHERE ${field} = ?`,
      );
      return stmt.get(value);
    } catch (err) {
      if (err.message === `no such table: ${table}`) {
        throw new Error("table does not exist");
      } else {
        console.error(err);
      }
    }
  }

  insertOne<T>(table: string, data: T) {
    const keys = Object.keys(data);
    let values = [];

    keys.forEach(k => {
      values.push(typeof data[k] === "string" ? `'${data[k]}'` : data[k]);
    });

    try {
      const stmt = this.database.prepare(
        `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${values.join(
          ", ",
        )})`,
      );
      return stmt.run();
    } catch (err) {
      if (err.message === `no such table: ${table}`) {
        throw new Error("table does not exist");
      } else {
        console.error(err);
      }
    }
  }
}

export default SQLiteDatabaseProvider;
