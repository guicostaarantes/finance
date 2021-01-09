import { Express } from "express-serve-static-core";
import { IAppProviders } from "../../providers/IAppProviders";
import CreateUserService from "../../services/CreateUserService";

const LoadCreateUserRoute = (app: Express, providers: IAppProviders) => {
  app.post("/users", async (req, res) => {
    const service = new CreateUserService(providers.database, providers.hash);

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
};

export default LoadCreateUserRoute;
