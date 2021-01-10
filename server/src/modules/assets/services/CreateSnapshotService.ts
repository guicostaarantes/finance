import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";
import {
  ICreateSnapshotData,
  ICreateSnapshotInput,
} from "../entities/ISnapshot";

class CreateSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, input: ICreateSnapshotInput) {
    console.log(userId);
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const exists = this.databaseProvider.findOne("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "date", compare: "=", value: input.date },
    ]);

    if (exists) {
      throw new AppError("Snapshot with same date exists", 409);
    }

    this.databaseProvider.insertOne<ICreateSnapshotData>("snapshots", {
      ...input,
      userId,
    });
  }
}

export default CreateSnapshotService;
