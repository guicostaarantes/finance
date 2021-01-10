import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import UpdateCurrencyService from "@/modules/assets/services/UpdateCurrencyService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateCurrencyRoute = (app: Express, providers: IAppProviders) => {
  app.put("/currencies/:id", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new UpdateCurrencyService(providers.database);
    await service.execute(userId, req.params.id, req.body);
    res.send({
      status: "success",
      message: "Currency updated",
    });
  });
};

export default LoadCreateCurrencyRoute;
