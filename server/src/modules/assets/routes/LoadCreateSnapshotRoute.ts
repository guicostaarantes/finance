import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import CreateSnapshotService from "@/modules/assets/services/CreateSnapshotService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateSnapshotRoute = (app: Express, providers: IAppProviders) => {
  app.post("/snapshots", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new CreateSnapshotService(providers.database);
    await service.execute(userId, req.body);
    res.send({
      status: "success",
      message: "Snapshot created",
    });
  });
};

export default LoadCreateSnapshotRoute;
