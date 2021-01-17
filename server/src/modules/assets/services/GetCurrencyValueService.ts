import { ICurrencyValue } from "@assets/entities/ICurrencyValue";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class GetCurrencyValueService {
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
  ): Promise<ICurrencyValue> {
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

    const result = this.databaseProvider.findOne("currencyValues", [
      { field: "snapshotId", compare: "=", value: snapshotId },
      { field: "currencyId", compare: "=", value: currencyId },
    ]);

    if (!result) {
      this.errorProvider.throw("Currency value not found", "404");
    }

    return result as ICurrencyValue;
  }
}

export default GetCurrencyValueService;
