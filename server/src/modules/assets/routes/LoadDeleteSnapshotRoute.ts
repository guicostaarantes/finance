import { Express } from "express-serve-static-core";
import { IAppProviders } from "@/providers/IAppProviders";
import DeleteSnapshotService from "@/modules/assets/services/DeleteSnapshotService";
import ValidateTokenService from "@/modules/users/services/ValidateTokenService";

const LoadCreateSnapshotRoute = (app: Express, providers: IAppProviders) => {
  app.delete("/snapshots/:id", async (req, res) => {
    const sessionService = new ValidateTokenService(providers.database);
    const userId = await sessionService.execute(req.headers["authorization"]);

    const service = new DeleteSnapshotService(providers.database);
    await service.execute(userId, req.params.id);
    res.send({
      status: "success",
      message: "Snapshot deleted",
    });
  });
};

export default LoadCreateSnapshotRoute;
