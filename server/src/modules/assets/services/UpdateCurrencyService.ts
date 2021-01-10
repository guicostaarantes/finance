import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateCurrencyData,
  ICreateCurrencyInput,
  ICurrency,
} from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";

class UpdateCurrencyService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, id: string, input: ICreateCurrencyInput) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const resource = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      this.errorProvider.throw("Currency not found", "404");
    }

    const exists = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists && exists.id != id) {
      this.errorProvider.throw("Currency with same name exists", "409");
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
