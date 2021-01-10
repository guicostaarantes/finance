import { IAsset, ICreateAssetInput } from "@/modules/assets/entities/IAsset";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "../entities/ISnapshot";

class UpdateAssetService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string, input: ICreateAssetInput) {
    const resource = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Asset not found", 404);
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: resource.snapshot_id },
    ]);

    if (!owner) {
      throw new AppError("Asset not found", 404);
    }

    const exists = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "snapshot_id", compare: "=", value: input.snapshot_id },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists && exists.id != id) {
      throw new AppError("Asset with same name exists in this snapshot", 409);
    }

    this.databaseProvider.updateOne<ICreateAssetInput>(
      "assets",
      [{ field: "id", compare: "=", value: id }],
      input,
    );
  }
}

export default UpdateAssetService;