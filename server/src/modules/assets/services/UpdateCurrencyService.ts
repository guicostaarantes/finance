import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateCurrencyData,
  ICreateCurrencyInput,
  ICurrency,
} from "@/modules/assets/entities/ICurrency";

class UpdateCurrencyService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string, input: ICreateCurrencyInput) {
    const resource = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Currency not found", 404);
    }

    const exists = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "user_id", compare: "=", value: userId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists && exists.id != id) {
      throw new AppError("Currency with same name exists", 409);
    }

    this.databaseProvider.updateOne<ICreateCurrencyData>(
      "currencies",
      [{ field: "id", compare: "=", value: id }],
      {
        ...input,
        user_id: userId,
      },
    );
  }
}

export default UpdateCurrencyService;
