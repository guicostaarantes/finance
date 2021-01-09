import { Express } from "express-serve-static-core";
import { IAppProviders } from "../../providers/IAppProviders";
import CreateUserService from "../../services/CreateUserService";

const LoadCreateUserRoute = (app: Express, providers: IAppProviders) => {
  app.post("/users", async (req, res) => {
    const service = new CreateUserService(providers.database, providers.hash);
    await service.execute(req.body);
    res.send({
      status: "success",
      message: "User created",
    });
  });
};

export default LoadCreateUserRoute;
