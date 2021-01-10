import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";
import {
  ICreateSnapshotData,
  ICreateSnapshotInput,
} from "../entities/ISnapshot";

class CreateSnapshotService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(userId: string, input: ICreateSnapshotInput) {
    console.log(userId);
    if (!userId) {
      this.errorProvider.throw("Not authorized", "401");
    }

    const exists = this.databaseProvider.findOne("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "date", compare: "=", value: input.date },
    ]);

    if (exists) {
      this.errorProvider.throw("Snapshot with same date exists", "409");
    }

    this.databaseProvider.insertOne<ICreateSnapshotData>("snapshots", {
      ...input,
      userId,
    });
  }
}

export default CreateSnapshotService;
