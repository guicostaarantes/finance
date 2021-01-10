import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAsset } from "@/modules/assets/entities/IAsset";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrencyValue } from "@/modules/assets/entities/ICurrencyValue";

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

    const assets = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "snapshot_id", compare: "=", value: id },
    ]);

    assets.forEach(asset => {
      this.databaseProvider.deleteOne("assets", [
        { field: "id", compare: "=", value: asset.id },
      ]);
    });

    const currencyValues = this.databaseProvider.findMany<ICurrencyValue>(
      "currency_values",
      [{ field: "snapshot_id", compare: "=", value: id }],
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
