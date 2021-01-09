import { IUser } from "@/modules/users/entities/IUser";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";

class FindUserByIdService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  execute(id: string) {
    const user = this.databaseProvider.findOne<IUser>("users", [
      { field: "id", compare: "=", value: id },
    ]);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    delete user.password;

    return user;
  }
}

export default FindUserByIdService;
