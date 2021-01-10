import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import DeleteCurrencyService from "@/modules/assets/services/DeleteCurrencyService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateCurrencyRoute = (app: Express, providers: IAppProviders) => {
  app.delete("/currencies/:id", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new DeleteCurrencyService(providers.database);
    await service.execute(userId, req.params.id);
    res.send({
      status: "success",
      message: "Currency deleted",
    });
  });
};

export default LoadCreateCurrencyRoute;
