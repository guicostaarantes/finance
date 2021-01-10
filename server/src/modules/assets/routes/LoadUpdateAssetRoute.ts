import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import UpdateAssetService from "@/modules/assets/services/UpdateAssetService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateAssetRoute = (app: Express, providers: IAppProviders) => {
  app.put("/assets/:id", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new UpdateAssetService(providers.database);
    await service.execute(userId, req.params.id, req.body);
    res.send({
      status: "success",
      message: "Asset updated",
    });
  });
};

export default LoadCreateAssetRoute;
