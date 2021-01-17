import { IAsset } from "@assets/entities/IAsset";
import { ICurrencyValue } from "@assets/entities/ICurrencyValue";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class GetSnapshotTotalAmountService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(
    userId: string,
    snapshotId: string,
    currencyId: string,
  ): Promise<number> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const snapshot = this.databaseProvider.findOne("snapshots", [
      { field: "id", compare: "=", value: snapshotId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!snapshot) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    const currency = this.databaseProvider.findOne("currencies", [
      { field: "id", compare: "=", value: currencyId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!currency) {
      this.errorProvider.throw("Currency not found", "404");
    }

    const values = this.databaseProvider
      .findMany<ICurrencyValue>("currencyValues", [
        { field: "snapshotId", compare: "=", value: snapshotId },
      ])
      .reduce((acc, cur) => ({ ...acc, [cur.currencyId]: cur.price }), {});

    const total = this.databaseProvider
      .findMany<IAsset>("assets", [
        { field: "snapshotId", compare: "=", value: snapshotId },
      ])
      .reduce(
        (acc, cur) =>
          acc + (cur.amount * values[cur.currencyId]) / values[currencyId],
        0,
      );

    return total;
  }
}

export default GetSnapshotTotalAmountService;
