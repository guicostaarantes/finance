import { ICurrency } from "@assets/entities/ICurrency";
import {
    ICreateCurrencyValueData, ICreateCurrencyValueInput, ICurrencyValue
} from "@assets/entities/ICurrencyValue";
import { ISnapshot } from "@assets/entities/ISnapshot";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class CreateCurrencyValueService {
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
    input: ICreateCurrencyValueInput,
  ) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: snapshotId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: currencyId },
    ]);

    if (!owner2) {
      this.errorProvider.throw("Currency not found", "404");
    }

    const exists = this.databaseProvider.findOne<ICurrencyValue>(
      "currencyValues",
      [
        { field: "snapshotId", compare: "=", value: snapshotId },
        { field: "currencyId", compare: "=", value: currencyId },
      ],
    );

    if (exists) {
      this.errorProvider.throw(
        "Currency value already exists in this snapshot",
        "409",
      );
    }

    this.databaseProvider.insertOne<ICreateCurrencyValueData>(
      "currencyValues",
      { ...input, snapshotId, currencyId },
    );
  }
}

export default CreateCurrencyValueService;
