import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAsset } from "@/modules/assets/entities/IAsset";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrencyValue } from "@/modules/assets/entities/ICurrencyValue";
import { IAppProviders } from "@/providers/IAppProviders";

class DeleteSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, id: string) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const resource = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Snapshot not found", 404);
    }

    const assets = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: id },
    ]);

    assets.forEach(asset => {
      this.databaseProvider.deleteOne("assets", [
        { field: "id", compare: "=", value: asset.id },
      ]);
    });

    const currencyValues = this.databaseProvider.findMany<ICurrencyValue>(
      "currencyValues",
      [{ field: "snapshotId", compare: "=", value: id }],
    );

    currencyValues.forEach(currencyValue => {
      this.databaseProvider.deleteOne("assets", [
        { field: "id", compare: "=", value: currencyValue.id },
      ]);
    });

    this.databaseProvider.deleteOne("snapshots", [
      { field: "id", compare: "=", value: id },
    ]);
  }
}

export default DeleteSnapshotService;
