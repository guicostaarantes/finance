import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";

class GetCurrencyService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, currencyId: string): Promise<ICurrency> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const result = this.databaseProvider.findOne("currencies", [
      { field: "id", compare: "=", value: currencyId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!result) {
      this.errorProvider.throw("Currency not found", "404");
    }

    return result as ICurrency;
  }
}

export default GetCurrencyService;
