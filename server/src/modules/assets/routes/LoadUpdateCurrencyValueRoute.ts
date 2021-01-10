import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import UpdateCurrencyValueService from "@/modules/assets/services/UpdateCurrencyValueService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateCurrencyValueRoute = (
  app: Express,
  providers: IAppProviders,
) => {
  app.put("/snapshots/:sid/currencies/:cid", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new UpdateCurrencyValueService(providers.database);
    await service.execute(userId, req.params.sid, req.params.cid, req.body);
    res.send({
      status: "success",
      message: "Currency value updated",
    });
  });
};

export default LoadCreateCurrencyValueRoute;
