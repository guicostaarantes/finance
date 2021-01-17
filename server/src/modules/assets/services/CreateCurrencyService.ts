import { ICreateCurrencyData, ICreateCurrencyInput } from "@assets/entities/ICurrency";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class CreateCurrencyService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, input: ICreateCurrencyInput) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const exists = this.databaseProvider.findOne("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      this.errorProvider.throw("Currency with same name exists", "409");
    }

    this.databaseProvider.insertOne<ICreateCurrencyData>("currencies", {
      ...input,
      userId,
    });
  }
}

export default CreateCurrencyService;
