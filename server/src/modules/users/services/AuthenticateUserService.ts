import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IHashProvider } from "@providers/hash/IHashProvider";
import { IAppProviders } from "@providers/IAppProviders";
import { ITokenProvider } from "@providers/Token/ITokenProvider";
import { IAuthenticateUserInput, ISession } from "@users/entities/IAuth";
import { IUser } from "@users/entities/IUser";

class AuthenticateUserService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;
  hashProvider: IHashProvider;
  tokenProvider: ITokenProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
    this.hashProvider = providers.hash;
    this.tokenProvider = providers.token;
  }

  async execute(input: IAuthenticateUserInput) {
    const user = this.databaseProvider.findOne<IUser>("users", [
      { field: "email", compare: "=", value: input.email },
    ]);

    if (!user) {
      this.errorProvider.throw("Incorrect credentials", "401");
    }

    const valid = await this.hashProvider.compare(
      input.password,
      user.password,
    );

    if (!valid) {
      this.errorProvider.throw("Incorrect credentials", "401");
    }

    const activeSession = this.databaseProvider.findOne<IUser>("sessions", [
      { field: "userId", compare: "=", value: user.id },
      {
        field: "expiresAt",
        compare: ">",
        value: (Date.now() / 1000) >> 0,
      },
    ]);

    if (activeSession) {
      this.databaseProvider.updateOne(
        "sessions",
        [{ field: "id", compare: "=", value: activeSession.id }],
        { expiresAt: (Date.now() / 1000) >> 0 },
      );
    }

    const data: ISession = {
      userId: user.id,
      token: this.tokenProvider.generate(),
      createdAt: (Date.now() / 1000) >> 0,
      expiresAt: ((Date.now() / 1000) >> 0) + 1800,
    };

    this.databaseProvider.insertOne<ISession>("sessions", data);

    return data;
  }
}

export default AuthenticateUserService;
