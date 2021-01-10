import {
  ICurrencyValue,
  ICreateCurrencyValueInput,
  ICreateCurrencyValueData,
} from "@/modules/assets/entities/ICurrencyValue";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class UpdateCurrencyValueService {
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
      throw new AppError("Snapshot not found", 404);
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: currencyId },
    ]);

    if (!owner2) {
      throw new AppError("Currency not found", 404);
    }

    this.databaseProvider.updateOne<ICreateCurrencyValueData>(
      "currencyValues",
      [
        { field: "snapshotId", compare: "=", value: snapshotId },
        { field: "currencyId", compare: "=", value: currencyId },
      ],
      { ...input, snapshotId, currencyId },
    );
  }
}

export default UpdateCurrencyValueService;
