import { IAsset } from "@assets/entities/IAsset";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class GetAssetService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, assetId: string): Promise<IAsset> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const asset: IAsset = this.databaseProvider.findOne("assets", [
      { field: "id", compare: "=", value: assetId },
    ]);

    if (!asset) {
      this.errorProvider.throw("Asset not found", "404");
    }

    const owner = this.databaseProvider.findOne("snapshots", [
      { field: "id", compare: "=", value: asset.snapshotId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Asset not found", "404");
    }

    return asset;
  }
}

export default GetAssetService;
