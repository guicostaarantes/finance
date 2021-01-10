import {
  ICreateAssetData,
  ICreateAssetInput,
} from "@/modules/assets/entities/IAsset";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";

class CreateAssetService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, input: ICreateAssetInput) {
    const owner = this.databaseProvider.findOne("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.snapshot_id },
    ]);

    if (!owner) {
      throw new AppError("Access forbidden", 403);
    }

    const exists = this.databaseProvider.findOne("assets", [
      { field: "snapshot_id", compare: "=", value: input.snapshot_id },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      throw new AppError("Asset with same name exists in this snapshot", 409);
    }

    this.databaseProvider.insertOne<ICreateAssetData>("assets", input);
  }
}

export default CreateAssetService;
