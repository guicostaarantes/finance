import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";

class ListCurrenciesService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string): Promise<ICurrency[]> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    return this.databaseProvider.findMany("currencies", [
      { field: "userId", compare: "=", value: userId },
    ]);
  }
}

export default ListCurrenciesService;
