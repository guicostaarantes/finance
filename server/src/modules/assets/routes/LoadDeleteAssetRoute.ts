import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import DeleteAssetService from "@/modules/assets/services/DeleteAssetService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateAssetRoute = (app: Express, providers: IAppProviders) => {
  app.delete("/assets/:id", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new DeleteAssetService(providers.database);
    await service.execute(userId, req.params.id);
    res.send({
      status: "success",
      message: "Asset deleted",
    });
  });
};

export default LoadCreateAssetRoute;
