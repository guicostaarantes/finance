import {
  IAuthenticateUserData,
  IAuthenticateUserInput,
} from "@/modules/users/entities/IAuth";
import AppError from "@/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IHashProvider } from "@/providers/hash/IHashProvider";
import { ITokenProvider } from "@/providers/Token/ITokenProvider";
import { IUser } from "../entities/IUser";

class AuthenticateUserService {
  databaseProvider: IDatabaseProvider;
  hashProvider: IHashProvider;
  tokenProvider: ITokenProvider;

  constructor(
    databaseProvider: IDatabaseProvider,
    hashProvider: IHashProvider,
    tokenProvider: ITokenProvider,
  ) {
    this.databaseProvider = databaseProvider;
    this.hashProvider = hashProvider;
    this.tokenProvider = tokenProvider;
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
      { field: "user_id", compare: "=", value: user.id },
      {
        field: "expires_at",
        compare: ">",
        value: String((Date.now() / 1000) >> 0),
      },
    ]);

    if (activeSession) {
      this.databaseProvider.updateOne(
        "sessions",
        [{ field: "id", compare: "=", value: activeSession.id }],
        { expires_at: (Date.now() / 1000) >> 0 },
      );
    }

    const data: IAuthenticateUserData = {
      user_id: user.id,
      token: this.tokenProvider.generate(),
      created_at: (Date.now() / 1000) >> 0,
      expires_at: ((Date.now() / 1000) >> 0) + 1800,
    };

    this.databaseProvider.insertOne<IAuthenticateUserData>("sessions", data);

    return data;
  }
}

export default AuthenticateUserService;
