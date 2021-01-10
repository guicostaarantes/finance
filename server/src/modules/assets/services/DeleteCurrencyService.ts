import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAsset } from "@/modules/assets/entities/IAsset";
import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { ICurrencyValue } from "@/modules/assets/entities/ICurrencyValue";
import { IAppProviders } from "@/providers/IAppProviders";

class DeleteCurrencyService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, id: string) {
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

    const assetDependency = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "currencyId", compare: "=", value: id },
    ]);

    if (assetDependency.length) {
      this.errorProvider.throw(
        "Currency cannot be deleted since assets depend on it",
        "409",
      );
    }

    const currencyValues = this.databaseProvider.findMany<ICurrencyValue>(
      "currencyValues",
      [{ field: "snapshotId", compare: "=", value: id }],
    );

    currencyValues.forEach(currencyValue => {
      this.databaseProvider.deleteOne("assets", [
        { field: "id", compare: "=", value: currencyValue.id },
      ]);
    });

    this.databaseProvider.deleteOne("currencies", [
      { field: "id", compare: "=", value: id },
    ]);
  }
}

export default DeleteCurrencyService;
