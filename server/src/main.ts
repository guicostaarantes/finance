import express from "express";
import cors from "cors";
import SQLiteDatabaseProvider from "./providers/database/impl/SQLiteDatabaseProvider";
import path from "path";
import BcryptHashProvider from "./providers/hash/impl/BcryptHashProvider";
import CreateUserService from "./services/CreateUserService";

const app = express();
app.use(cors());
app.use(express.json());

const database = new SQLiteDatabaseProvider(
  path.join(__dirname, "..", "db.sqlite3"),
);
const hash = new BcryptHashProvider(8);

app.post("/users", async (req, res) => {
  const service = new CreateUserService(database, hash);

  await service.execute(req.body);

  res.send("user created");
});

app.listen(process.env.PORT, () => {
  console.log(`Finance server listening to port ${process.env.PORT}`);
});
