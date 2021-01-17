import { ISnapshot } from "@assets/entities/ISnapshot";
import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IAppProviders } from "@providers/IAppProviders";

class ListSnapshotsService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string): Promise<ISnapshot[]> {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    return this.databaseProvider.findMany("snapshots", [
      { field: "userId", compare: "=", value: userId },
    ]);
  }
}

export default ListSnapshotsService;
