import { IAsset } from "@/modules/assets/entities/IAsset";
import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";

class ListAssetsOfSnapshotService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, snapshotId: string): Promise<IAsset[]> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const owner = this.databaseProvider.findOne("snapshots", [
      { field: "id", compare: "=", value: snapshotId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!owner) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    return this.databaseProvider.findMany("assets", [
      { field: "snapshotId", compare: "=", value: snapshotId },
    ]);
  }
}

export default ListAssetsOfSnapshotService;
