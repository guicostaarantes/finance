import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateSnapshotData,
  ICreateSnapshotInput,
} from "../entities/ISnapshot";

class CreateSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, input: ICreateSnapshotInput) {
    const exists = this.databaseProvider.findOne("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "date", compare: "=", value: input.date },
      { field: "name", compare: "=", value: input.name },
    ]);

    if (exists) {
      throw new AppError("Snapshot with same name and date exists", 409);
    }

    this.databaseProvider.insertOne<ICreateSnapshotData>("snapshots", {
      ...input,
      user_id: userId,
    });
  }
}

export default CreateSnapshotService;
