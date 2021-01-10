import { IAsset, ICreateAssetInput } from "@/modules/assets/entities/IAsset";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class UpdateAssetService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, id: string, input: ICreateAssetInput) {
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

    const candidate = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.snapshotId },
    ]);

    if (!candidate) {
      throw new AppError("Snapshot not found", 404);
    }

    const candidate2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.currencyId },
    ]);

    if (!candidate2) {
      throw new AppError("Currency not found", 404);
    }

    const exists = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: input.snapshotId },
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
