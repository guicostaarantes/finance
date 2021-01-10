import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";
import {
  ICreateSnapshotData,
  ICreateSnapshotInput,
  ISnapshot,
} from "../entities/ISnapshot";

class UpdateSnapshotService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(userId: string, id: string, input: ICreateSnapshotInput) {
    if (!userId) {
      throw new AppError("Not authorized", 401);
    }

    const resource = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
      { field: "id", compare: "=", value: id },
    ]);

    if (!resource) {
      throw new AppError("Snapshot not found", 404);
    }

    const exists = this.databaseProvider.findOne<ISnapshot>("snapshots", [
      { field: "userId", compare: "=", value: userId },
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
        userId,
      },
    );
  }
}

export default UpdateSnapshotService;
