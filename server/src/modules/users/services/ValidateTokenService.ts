import { ISession } from "@/modules/users/entities/IAuth";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";

class ValidateTokenService {
  databaseProvider: IDatabaseProvider;

  constructor(databaseProvider: IDatabaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  async execute(token: string) {
    if (!token) {
      throw new AppError("Invalid credentials", 401);
    }

    const session = this.databaseProvider.findOne<ISession>("sessions", [
      { field: "token", compare: "=", value: token },
      { field: "expires_at", compare: ">", value: (Date.now() / 1000) >> 0 },
    ]);

    if (!session) {
      throw new AppError("Invalid credentials", 401);
    }

    return session.user_id;
  }
}

export default ValidateTokenService;
