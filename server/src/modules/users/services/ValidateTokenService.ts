import { ISession } from "@/modules/users/entities/IAuth";
import { IErrorProvider } from "@/providers/error/IErrorProvider";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IAppProviders } from "@/providers/IAppProviders";

class ValidateTokenService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
  }

  async execute(token: string) {
    if (!token) {
      this.errorProvider.throw("Invalid credentials", "401");
    }

    const session = this.databaseProvider.findOne<ISession>("sessions", [
      { field: "token", compare: "=", value: token },
      { field: "expiresAt", compare: ">", value: (Date.now() / 1000) >> 0 },
    ]);

    if (!session) {
      this.errorProvider.throw("Invalid credentials", "401");
    }

    return session.userId;
  }
}

export default ValidateTokenService;
