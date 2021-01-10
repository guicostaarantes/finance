import {
  ICreateCurrencyValueData,
  ICreateCurrencyValueInput,
  ICurrencyValue,
} from "@/modules/assets/entities/ICurrencyValue";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";

class CreateCurrencyValueService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, input: ICreateCurrencyValueInput) {
    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.snapshot_id },
    ]);

    if (!owner) {
      throw new AppError("Snapshot not found", 404);
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.currency_id },
    ]);

    if (!owner2) {
      throw new AppError("Currency not found", 404);
    }

    const exists = this.databaseProvider.findOne<ICurrencyValue>(
      "currency_values",
      [
        { field: "snapshot_id", compare: "=", value: input.snapshot_id },
        { field: "currency_id", compare: "=", value: input.currency_id },
      ],
    );

    if (exists) {
      throw new AppError("Currency value already exists in this snapshot", 409);
    }

    this.databaseProvider.insertOne<ICreateCurrencyValueData>(
      "currency_values",
      input,
    );
  }
}

export default CreateCurrencyValueService;
