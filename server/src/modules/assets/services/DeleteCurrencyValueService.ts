import { ICurrencyValue } from "@/modules/assets/entities/ICurrencyValue";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { IAsset } from "@/modules/assets/entities/IAsset";
import { IAppProviders } from "@/providers/IAppProviders";

class DeleteCurrencyValueService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, snapshotId: string, currencyId: string) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const resource = this.databaseProvider.findOne<ICurrencyValue>(
      "currencyValues",
      [
        { field: "snapshotId", compare: "=", value: snapshotId },
        { field: "currencyId", compare: "=", value: currencyId },
      ],
    );

    if (!resource) {
      throw new AppError("Currency value not found", 404);
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: snapshotId },
    ]);

    if (!owner) {
      throw new AppError("Currency value not found", 404);
    }

    const assetDependency = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: resource.snapshotId },
      { field: "currencyId", compare: "=", value: resource.currencyId },
    ]);

    if (assetDependency.length) {
      throw new AppError(
        "Currency value cannot be deleted since assets depend on it",
        409,
      );
    }

    this.databaseProvider.deleteOne("currencyValues", [
      { field: "snapshotId", compare: "=", value: snapshotId },
      { field: "currencyId", compare: "=", value: currencyId },
    ]);
  }
}

export default DeleteCurrencyValueService;
