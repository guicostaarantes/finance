import { IAsset } from "@/modules/assets/entities/IAsset";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";

class DeleteAssetService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string) {
    const resource = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "id", compare: "=", value: id },
    ]);

    const owner = this.databaseProvider.findOne("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: resource.snapshot_id },
    ]);

    if (!owner) {
      throw new AppError("Access forbidden", 403);
    }

    this.databaseProvider.deleteOne("assets", [
      { field: "id", compare: "=", value: id },
    ]);
  }
}

export default DeleteAssetService;
