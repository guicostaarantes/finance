import {
  ICurrencyValue,
  ICreateCurrencyValueInput,
  ICreateCurrencyValueData,
} from "@/modules/assets/entities/ICurrencyValue";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";

class UpdateCurrencyValueService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(
    userId: string,
    snapshotId: string,
    currencyId: string,
    input: ICreateCurrencyValueInput,
  ) {
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
      throw new AppError("Snapshot not found", 404);
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: currencyId },
    ]);

    if (!owner2) {
      throw new AppError("Currency not found", 404);
    }

    this.databaseProvider.updateOne<ICreateCurrencyValueData>(
      "currency_values",
      [
        { field: "snapshot_id", compare: "=", value: snapshotId },
        { field: "currency_id", compare: "=", value: currencyId },
      ],
      { ...input, snapshot_id: snapshotId, currency_id: currencyId },
    );
  }
}

export default UpdateCurrencyValueService;
