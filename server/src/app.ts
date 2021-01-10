import express from "express";
import cors from "cors";
import "express-async-errors";
import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import AppError from "@/modules/errors/AppError";
import LoadCreateUserRoute from "@/modules/users/routes/LoadCreateUserRoute";
import LoadAuthenticateUserRoute from "@/modules/users/routes/LoadAuthenticateUserRoute";
import LoadCreateSnapshotRoute from "./modules/assets/routes/LoadCreateSnapshotRoute";
import LoadUpdateSnapshotRoute from "./modules/assets/routes/LoadUpdateSnapshotRoute";
import LoadDeleteSnapshotRoute from "./modules/assets/routes/LoadDeleteSnapshotRoute";
import LoadCreateAssetRoute from "@/modules/assets/routes/LoadCreateAssetRoute";
import LoadUpdateAssetRoute from "@/modules/assets/routes/LoadUpdateAssetRoute";
import LoadDeleteAssetRoute from "@/modules/assets/routes/LoadDeleteAssetRoute";
import LoadCreateCurrencyRoute from "@/modules/assets/routes/LoadCreateCurrencyRoute";
import LoadUpdateCurrencyRoute from "@/modules/assets/routes/LoadUpdateCurrencyRoute";
import LoadDeleteCurrencyRoute from "@/modules/assets/routes/LoadDeleteCurrencyRoute";
import LoadCreateCurrencyValueRoute from "@/modules/assets/routes/LoadCreateCurrencyValueRoute";
import LoadUpdateCurrencyValueRoute from "@/modules/assets/routes/LoadUpdateCurrencyValueRoute";
import LoadDeleteCurrencyValueRoute from "@/modules/assets/routes/LoadDeleteCurrencyValueRoute";

class App {
  app: Express;
  providers: IAppProviders;

  constructor(providers: IAppProviders) {
    this.providers = providers;

    this.app = express();
    this.app.use(cors());
    this.app.use(express.json());

    LoadCreateUserRoute(this.app, this.providers);
    LoadAuthenticateUserRoute(this.app, this.providers);
    LoadCreateSnapshotRoute(this.app, this.providers);
    LoadUpdateSnapshotRoute(this.app, this.providers);
    LoadDeleteSnapshotRoute(this.app, this.providers);
    LoadCreateAssetRoute(this.app, this.providers);
    LoadUpdateAssetRoute(this.app, this.providers);
    LoadDeleteAssetRoute(this.app, this.providers);
    LoadCreateCurrencyRoute(this.app, this.providers);
    LoadUpdateCurrencyRoute(this.app, this.providers);
    LoadDeleteCurrencyRoute(this.app, this.providers);
    LoadCreateCurrencyValueRoute(this.app, this.providers);
    LoadUpdateCurrencyValueRoute(this.app, this.providers);
    LoadDeleteCurrencyValueRoute(this.app, this.providers);

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
