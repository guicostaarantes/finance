import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateCurrencyData,
  ICreateCurrencyInput,
  ICurrency,
} from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class UpdateCurrencyService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, id: string, input: ICreateCurrencyInput) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const resource = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Currency not found", 404);
    }

    const exists = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
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
        userId,
      },
    );
  }
}

export default UpdateCurrencyService;
