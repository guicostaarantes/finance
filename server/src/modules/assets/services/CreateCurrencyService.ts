import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateCurrencyData,
  ICreateCurrencyInput,
} from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class CreateCurrencyService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, input: ICreateCurrencyInput) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const exists = this.databaseProvider.findOne("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      throw new AppError("Currency with same name exists", 409);
    }

    this.databaseProvider.insertOne<ICreateCurrencyData>("currencies", {
      ...input,
      userId,
    });
  }
}

export default CreateCurrencyService;
