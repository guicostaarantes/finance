import path from "path";
import App from "@/app";
import SQLiteDatabaseProvider from "@/providers/database/impl/SQLiteDatabaseProvider";
import BcryptHashProvider from "@/providers/hash/impl/BcryptHashProvider";
import RandTokenProvider from "./providers/token/impl/RandTokenProvider";

const database = new SQLiteDatabaseProvider(
  path.join(__dirname, "..", "db.sqlite3"),
);
const hash = new BcryptHashProvider(8);
const token = new RandTokenProvider(64);

const server = new App({ database, hash, token });

server.listen(Number(process.env.PORT));
