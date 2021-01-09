import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import AuthenticateUserService from "@/modules/users/services/AuthenticateUserService";

const LoadAuthenticateUserRoute = (app: Express, providers: IAppProviders) => {
  app.post("/sessions", async (req, res) => {
    const service = new AuthenticateUserService(
      providers.database,
      providers.hash,
      providers.token,
    );
    const data = await service.execute(req.body);
    res.send(data);
  });
};

export default LoadAuthenticateUserRoute;
