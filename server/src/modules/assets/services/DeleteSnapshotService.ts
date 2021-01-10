import { IAsset } from "@/modules/assets/entities/IAsset";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "../entities/ISnapshot";

class DeleteSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string) {
    const resource = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Snapshot not found", 404);
    }

    this.databaseProvider.deleteOne("snapshots", [
      { field: "id", compare: "=", value: id },
    ]);

    // TODO: delete assets and currency_values related to this
  }
}

export default DeleteSnapshotService;
