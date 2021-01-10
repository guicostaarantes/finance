import {
  IAsset,
  ICreateAssetData,
  ICreateAssetInput,
} from "@/modules/assets/entities/IAsset";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { ISnapshot } from "@/modules/assets/entities/ISnapshot";
import { ICurrency } from "@/modules/assets/entities/ICurrency";
import { IAppProviders } from "@/providers/IAppProviders";
import { IErrorProvider } from "@/providers/error/IErrorProvider";

class CreateAssetService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, input: ICreateAssetInput) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.snapshotId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    const owner2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.currencyId },
    ]);

    if (!owner2) {
      this.errorProvider.throw("Currency not found", "404");
    }

    const exists = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: input.snapshotId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      this.errorProvider.throw(
        "Asset with same name exists in this snapshot",
        "409",
      );
    }

    this.databaseProvider.insertOne<ICreateAssetData>("assets", input);
  }
}

export default CreateAssetService;
