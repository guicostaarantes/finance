import express from "express";
import cors from "cors";
import { Express } from "express-serve-static-core";
import { IDatabaseProvider } from "./providers/database/IDatabaseProvider";
import { IHashProvider } from "./providers/hash/IHashProvider";
import { IAppProviders } from "./providers/IAppProviders";
import LoadCreateUserRoute from "./routes/users/create";

class App {
  app: Express;
  providers: IAppProviders;

  constructor(
    databaseProvider: IDatabaseProvider,
    hashProvider: IHashProvider,
  ) {
    this.providers = {
      database: databaseProvider,
      hash: hashProvider,
    };

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    LoadCreateUserRoute(this.app, this.providers);
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Finance server listening to port ${port}`);
    });
  }
}

export default App;
