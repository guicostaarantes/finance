import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import DeleteCurrencyValueService from "@/modules/assets/services/DeleteCurrencyValueService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateCurrencyValueRoute = (
  app: Express,
  providers: IAppProviders,
) => {
  app.delete("/snapshots/:sid/currencies/:cid", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new DeleteCurrencyValueService(providers.database);
    await service.execute(userId, req.params.sid, req.params.cid);
    res.send({
      status: "success",
      message: "Currency value deleted",
    });
  });
};

export default LoadCreateCurrencyValueRoute;
