import express from "express";
import cors from "cors";
import CreateUserService from "./services/CreateUserService";
import { Express } from "express-serve-static-core";
import { IDatabaseProvider } from "./providers/database/IDatabaseProvider";
import { IHashProvider } from "./providers/hash/IHashProvider";

class App {
  app: Express;
  databaseProvider: IDatabaseProvider;
  hashProvider: IHashProvider;

  constructor(
    databaseProvider: IDatabaseProvider,
    hashProvider: IHashProvider,
  ) {
    this.databaseProvider = databaseProvider;
    this.hashProvider = hashProvider;

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    this.app.post("/users", async (req, res) => {
      const service = new CreateUserService(
        this.databaseProvider,
        this.hashProvider,
      );

      try {
        await service.execute(req.body);
        res.send("user created");
      } catch (err) {
        if (err.message === "user with same email already registered") {
          res.status(409).send(err.message);
        } else {
          console.error(err);
          res.status(500).send("internal server error");
        }
      }
    });
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Finance server listening to port ${port}`);
    });
  }
}

export default App;
