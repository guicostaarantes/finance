import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import {
  ICreateSnapshotData,
  ICreateSnapshotInput,
  ISnapshot,
} from "../entities/ISnapshot";

class UpdateSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(userId: string, id: string, input: ICreateSnapshotInput) {
    const resource = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Snapshot not found", 404);
    }

    const exists = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "user_id", compare: "=", value: userId },
      { field: "date", compare: "=", value: input.date },
    ]);

    if (exists && exists.id != id) {
      throw new AppError("Snapshot with same date exists", 409);
    }

    this.databaseProvider.updateOne<ICreateSnapshotData>(
      "snapshots",
      [{ field: "id", compare: "=", value: id }],
      {
        ...input,
        user_id: userId,
      },
    );
  }
}

export default UpdateSnapshotService;
