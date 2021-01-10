import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAsset } from "@/modules/assets/entities/IAsset";
import { ICurrency } from "@/modules/assets/entities/ICurrency";

class DeleteCurrencyService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string) {
    const resource = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Currency not found", 404);
    }

    const assetDependency = this.databaseProvider.findMany<IAsset>("assets", [
      { field: "currency_id", compare: "=", value: id },
    ]);

    if (assetDependency.length) {
      throw new AppError(
        "Currency cannot be deleted since assets depend on it",
        409,
      );
    }

    this.databaseProvider.deleteOne("currencies", [
      { field: "id", compare: "=", value: id },
    ]);
  }
}

export default DeleteCurrencyService;
