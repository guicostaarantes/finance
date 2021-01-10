import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateCurrencyData,
  ICreateCurrencyInput,
} from "@/modules/assets/entities/ICurrency";

class CreateCurrencyService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, input: ICreateCurrencyInput) {
    const exists = this.databaseProvider.findOne("currencies", [
      { field: "user_id", compare: "=", value: userId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      throw new AppError("Currency with same name exists", 409);
    }

    this.databaseProvider.insertOne<ICreateCurrencyData>("currencies", {
      ...input,
      user_id: userId,
    });
  }
}

export default CreateCurrencyService;
