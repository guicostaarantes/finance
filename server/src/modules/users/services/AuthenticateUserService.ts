import {
  ISession,
  IAuthenticateUserInput,
} from "@/modules/users/entities/IAuth";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IHashProvider } from "@/providers/hash/IHashProvider";
import { ITokenProvider } from "@/providers/Token/ITokenProvider";
import { IUser } from "@/modules/users/entities/IUser";
import { IAppProviders } from "@/providers/IAppProviders";

class AuthenticateUserService {
  databaseProvider: IDatabaseProvider;
  hashProvider: IHashProvider;
  tokenProvider: ITokenProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.hashProvider = providers.hash;
    this.tokenProvider = providers.token;
  }

  async execute(input: IAuthenticateUserInput) {
    const user = this.databaseProvider.findOne<IUser>("users", [
      { field: "email", compare: "=", value: input.email },
    ]);

    if (!user) {
      throw new AppError("Incorrect credentials", 401);
    }

    const valid = await this.hashProvider.compare(
      input.password,
      user.password,
    );

    if (!valid) {
      throw new AppError("Incorrect credentials", 401);
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
