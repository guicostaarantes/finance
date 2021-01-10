import { ICurrencyValue } from "@/modules/assets/entities/ICurrencyValue";
import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { IAsset } from "@/modules/assets/entities/IAsset";
import { IAppProviders } from "@/providers/IAppProviders";

class DeleteCurrencyValueService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, snapshotId: string, currencyId: string) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const resource = this.databaseProvider.findOne<ICurrencyValue>(
      "currencyValues",
      [
        { field: "snapshotId", compare: "=", value: snapshotId },
        { field: "currencyId", compare: "=", value: currencyId },
      ],
    );

    if (!resource) {
      this.errorProvider.throw("Currency value not found", "404");
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: snapshotId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Currency value not found", "404");
    }

    const assetDependency = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: resource.snapshotId },
      { field: "currencyId", compare: "=", value: resource.currencyId },
    ]);

    if (assetDependency.length) {
      this.errorProvider.throw(
        "Currency value cannot be deleted since assets depend on it",
        "409",
      );
    }

    this.databaseProvider.deleteOne("currencyValues", [
      { field: "snapshotId", compare: "=", value: snapshotId },
      { field: "currencyId", compare: "=", value: currencyId },
    ]);
  }
}

export default DeleteCurrencyValueService;
