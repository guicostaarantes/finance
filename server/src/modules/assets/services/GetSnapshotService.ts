import { ISnapshot } from "@assets/entities/ISnapshot";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class GetSnapshotService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, snapshotId: string): Promise<ISnapshot> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const result = this.databaseProvider.findOne("snapshots", [
      { field: "id", compare: "=", value: snapshotId },
      { field: "userId", compare: "=", value: userId },
    ]);

    if (!result) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    return result as ISnapshot;
  }
}

export default GetSnapshotService;
