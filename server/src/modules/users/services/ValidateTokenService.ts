import { ISession } from "@/modules/users/entities/IAuth";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";

class ValidateTokenService {
  databaseProvider: IDatabaseProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
  }

  async execute(token: string) {
    if (!token) {
      throw new AppError("Invalid credentials", 401);
    }

    const session = this.databaseProvider.findOne<ISession>("sessions", [
      { field: "token", compare: "=", value: token },
      { field: "expiresAt", compare: ">", value: (Date.now() / 1000) >> 0 },
    ]);

    if (!session) {
      throw new AppError("Invalid credentials", 401);
    }

    return session.userId;
  }
}

export default ValidateTokenService;
