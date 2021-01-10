import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import CreateCurrencyService from "@/modules/assets/services/CreateCurrencyService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateCurrencyRoute = (app: Express, providers: IAppProviders) => {
  app.post("/currencies", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new CreateCurrencyService(providers.database);
    await service.execute(userId, req.body);
    res.send({
      status: "success",
      message: "Currency created",
    });
  });
};

export default LoadCreateCurrencyRoute;
