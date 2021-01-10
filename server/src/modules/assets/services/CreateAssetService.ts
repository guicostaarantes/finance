import {
  IAsset,
  ICreateAssetData,
  ICreateAssetInput,
} from "@/modules/assets/entities/IAsset";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class CreateAssetService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, input: ICreateAssetInput) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.snapshotId },
    ]);

    if (!owner) {
      throw new AppError("Snapshot not found", 404);
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.currencyId },
    ]);

    if (!owner2) {
      throw new AppError("Currency not found", 404);
    }

    const exists = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: input.snapshotId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      throw new AppError("Asset with same name exists in this snapshot", 409);
    }

    this.databaseProvider.insertOne<ICreateAssetData>("assets", input);
  }
}

export default CreateAssetService;
