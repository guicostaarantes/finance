import { IAsset } from "@/modules/assets/entities/IAsset";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";

class DeleteSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string) {
    const owner = this.databaseProvider.findOne("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!owner) {
      throw new AppError("Access forbidden", 403);
    }

    this.databaseProvider.deleteOne("snapshots", [
      { field: "id", compare: "=", value: id },
    ]);

    // TODO: delete assets and currency_values related to this
  }
}

export default DeleteSnapshotService;
