import { IAsset, ICreateAssetInput } from "@assets/entities/IAsset";
import { ICurrency } from "@assets/entities/ICurrency";
import { ISnapshot } from "@assets/entities/ISnapshot";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class UpdateAssetService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, id: string, input: ICreateAssetInput) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const resource = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      this.errorProvider.throw("Asset not found", "404");
    }

    const owner = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: resource.snapshotId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Asset not found", "404");
    }

    const candidate = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.snapshotId },
    ]);

    if (!candidate) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    const candidate2 = this.databaseProvider.findOne<ICurrency>("currencies", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: input.currencyId },
    ]);

    if (!candidate2) {
      this.errorProvider.throw("Currency not found", "404");
    }

    const exists = this.databaseProvider.findOne<IAsset>("assets", [
      { field: "snapshotId", compare: "=", value: input.snapshotId },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists && exists.id != id) {
      this.errorProvider.throw(
        "Asset with same name exists in this snapshot",
        "409",
      );
    }

    this.databaseProvider.updateOne<ICreateAssetInput>(
      "assets",
      [{ field: "id", compare: "=", value: id }],
      input,
    );
  }
}

export default UpdateAssetService;
