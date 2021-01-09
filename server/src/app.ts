import express from "express";
import cors from "cors";
import "express-async-errors";
import { Express } from "express-serve-static-core";
import { IDatabaseProvider } from "./providers/database/IDatabaseProvider";
import { IHashProvider } from "./providers/hash/IHashProvider";
import { IAppProviders } from "./providers/IAppProviders";
import LoadCreateUserRoute from "./modules/users/routes/create";
import LoadFindUserByIdRoute from "./modules/users/routes/findById";
import AppError from "./errors/AppError";

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
    LoadFindUserByIdRoute(this.app, this.providers);

    this.app.use((err, _req, res, _next) => {
      if (err instanceof AppError) {
        return res.status(err.statusCode).json({
          status: "error",
          message: err.message,
        });
      }

      console.error(err);

      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    });
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`Finance server listening to port ${port}`);
    });
  }
}

export default App;
