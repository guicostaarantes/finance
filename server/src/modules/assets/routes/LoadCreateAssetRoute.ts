import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import CreateAssetService from "@/modules/assets/services/CreateAssetService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateAssetRoute = (app: Express, providers: IAppProviders) => {
  app.post("/assets", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new CreateAssetService(providers.database);
    await service.execute(userId, req.body);
    res.send({
      status: "success",
      message: "Asset created",
    });
  });
};

export default LoadCreateAssetRoute;
