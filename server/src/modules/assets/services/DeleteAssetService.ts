import { IAsset } from "@/modules/assets/entities/IAsset";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";
import { ISnapshot } from "../entities/ISnapshot";

class DeleteAssetService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, id: string) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const resource = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Asset not found", 404);
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: resource.snapshotId },
    ]);

    if (!owner) {
      throw new AppError("Asset not found", 404);
    }

    this.databaseProvider.deleteOne("assets", [
      { field: "id", compare: "=", value: id },
    ]);
  }
}

export default DeleteAssetService;
