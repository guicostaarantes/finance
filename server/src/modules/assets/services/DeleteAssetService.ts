import { IAsset } from "@assets/entities/IAsset";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

import { ISnapshot } from "../entities/ISnapshot";

class DeleteAssetService {
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

    this.databaseProvider.deleteOne("assets", [
      { field: "id", compare: "=", value: id },
    ]);
  }
}

export default DeleteAssetService;
