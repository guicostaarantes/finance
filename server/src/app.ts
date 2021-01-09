import express from "express";
import cors from "cors";
import "express-async-errors";
import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import LoadCreateUserRoute from "@/modules/users/routes/create";
import LoadFindUserByIdRoute from "@/modules/users/routes/findById";
import AppError from "@/errors/AppError";
import LoadAuthenticateUserRoute from "./modules/users/routes/authenticate";

class App {
  app: Express;
  providers: IAppProviders;

  constructor(providers: IAppProviders) {
    this.providers = providers;

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    LoadCreateUserRoute(this.app, this.providers);
    LoadFindUserByIdRoute(this.app, this.providers);
    LoadAuthenticateUserRoute(this.app, this.providers);

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
