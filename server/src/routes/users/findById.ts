import { Express } from "express-serve-static-core";
import { IAppProviders } from "../../providers/IAppProviders";
import FindUserByIdService from "../../services/FindUserByIdService";

const LoadFindUserByIdRoute = (app: Express, providers: IAppProviders) => {
  app.get("/users/:id", async (req, res) => {
    const service = new FindUserByIdService(providers.database);
    const user = await service.execute(req.params.id);
    res.send(user);
  });
};

export default LoadFindUserByIdRoute;
