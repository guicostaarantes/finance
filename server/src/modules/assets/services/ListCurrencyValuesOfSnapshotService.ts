import { ICurrencyValue } from "@assets/entities/ICurrencyValue";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class ListCurrencyValuesOfSnapshotService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, snapshotId: string): Promise<ICurrencyValue[]> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const owner = this.databaseProvider.findOne("snapshots", [
      { field: "id", compare: "=", value: snapshotId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    return this.databaseProvider.findMany("currencyValues", [
      { field: "snapshotId", compare: "=", value: snapshotId },
    ]);
  }
}

export default ListCurrencyValuesOfSnapshotService;
