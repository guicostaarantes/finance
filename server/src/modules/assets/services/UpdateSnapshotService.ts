import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";
import {
  ICreateSnapshotData,
  ICreateSnapshotInput,
  ISnapshot,
} from "../entities/ISnapshot";

class UpdateSnapshotService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, id: string, input: ICreateSnapshotInput) {
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const resource = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      this.errorProvider.throw("Snapshot not found", "404");
    }

    const exists = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "date", compare: "=", value: input.date },
    ]);

    if (exists && exists.id != id) {
      this.errorProvider.throw("Snapshot with same date exists", "409");
    }

    this.databaseProvider.updateOne<ICreateSnapshotData>(
      "snapshots",
      [{ field: "id", compare: "=", value: id }],
      {
        ...input,
        userId,
      },
    );
  }
}

export default UpdateSnapshotService;
