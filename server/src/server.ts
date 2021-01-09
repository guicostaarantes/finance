import path from "path";
import App from "@/app";
import SQLiteDatabaseProvider from "@/providers/database/impl/SQLiteDatabaseProvider";
import BcryptHashProvider from "@/providers/hash/impl/BcryptHashProvider";

const database = new SQLiteDatabaseProvider(
  path.join(__dirname, "..", "db.sqlite3"),
);
const hash = new BcryptHashProvider(8);

const server = new App(database, hash);

server.listen(Number(process.env.PORT));
