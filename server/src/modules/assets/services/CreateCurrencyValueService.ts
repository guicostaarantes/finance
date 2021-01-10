import {
  ICreateCurrencyValueData,
  ICreateCurrencyValueInput,
  ICurrencyValue,
} from "@/modules/assets/entities/ICurrencyValue";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class CreateCurrencyValueService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(
    userId: string,
    snapshotId: string,
    currencyId: string,
    input: ICreateCurrencyValueInput,
  ) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: snapshotId },
    ]);

    if (!owner) {
      throw new AppError("Snapshot not found", 404);
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: currencyId },
    ]);

    if (!owner2) {
      throw new AppError("Currency not found", 404);
    }

    const exists = this.databaseProvider.findOne<ICurrencyValue>(
      "currencyValues",
      [
        { field: "snapshotId", compare: "=", value: snapshotId },
        { field: "currencyId", compare: "=", value: currencyId },
      ],
    );

    if (exists) {
      throw new AppError("Currency value already exists in this snapshot", 409);
    }

    this.databaseProvider.insertOne<ICreateCurrencyValueData>(
      "currencyValues",
      { ...input, snapshotId, currencyId },
    );
  }
}

export default CreateCurrencyValueService;
