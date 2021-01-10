import { ICurrencyValue } from "@/modules/assets/entities/ICurrencyValue";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { IAsset } from "@/modules/assets/entities/IAsset";

class DeleteCurrencyValueService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, snapshotId: string, currencyId: string) {
    const resource = this.databaseProvider.findOne<ICurrencyValue>(
      "currency_values",
      [
        { field: "snapshot_id", compare: "=", value: snapshotId },
        { field: "currency_id", compare: "=", value: currencyId },
      ],
    );

    if (!resource) {
      throw new AppError("Currency value not found", 404);
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: snapshotId },
    ]);

    if (!owner) {
      throw new AppError("Currency value not found", 404);
    }

    const assetDependency = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "snapshot_id", compare: "=", value: resource.snapshot_id },
      { field: "currency_id", compare: "=", value: resource.currency_id },
    ]);

    if (assetDependency.length) {
      throw new AppError(
        "Currency value cannot be deleted since assets depend on it",
        409,
      );
    }

    this.databaseProvider.deleteOne("currency_values", [
      { field: "snapshot_id", compare: "=", value: snapshotId },
      { field: "currency_id", compare: "=", value: currencyId },
    ]);
  }
}

export default DeleteCurrencyValueService;
