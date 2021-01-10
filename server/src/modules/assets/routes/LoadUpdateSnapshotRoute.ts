import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import UpdateSnapshotService from "@/modules/assets/services/UpdateSnapshotService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateSnapshotRoute = (app: Express, providers: IAppProviders) => {
  app.put("/snapshots/:id", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new UpdateSnapshotService(providers.database);
    await service.execute(userId, req.params.id, req.body);
    res.send({
      status: "success",
      message: "Snapshot updated",
    });
  });
};

export default LoadCreateSnapshotRoute;
