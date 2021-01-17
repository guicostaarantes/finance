import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IHashProvider } from "@providers/hash/IHashProvider";
import { IAppProviders } from "@providers/IAppProviders";
import { ICreateUserData, ICreateUserInput } from "@users/entities/IUser";

class CreateUserService {
  databaseProvider: IDatabaseProvider;
  errorProvider: IErrorProvider;
  hashProvider: IHashProvider;

  constructor(providers: IAppProviders) {
    this.databaseProvider = providers.database;
    this.errorProvider = providers.error;
    this.hashProvider = providers.hash;
  }

  async execute(input: ICreateUserInput) {
    const exists = this.databaseProvider.findOne("users", [
      { field: "email", compare: "=", value: input.email },
    ]);

    if (exists) {
      this.errorProvider.throw(
        "User with same email already registered",
        "409",
      );
    }

    const data: ICreateUserData = {
      email: input.email,
      password: await this.hashProvider.hash(input.password),
      createdAt: (Date.now() / 1000) >> 0,
    };

    this.databaseProvider.insertOne<ICreateUserData>("users", data);
  }
}

export default CreateUserService;
