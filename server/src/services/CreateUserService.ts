import { ICreateUserData, ICreateUserInput, IUser } from "../entities/IUser";
import { IDatabaseProvider } from "../providers/database/IDatabaseProvider";
import { IHashProvider } from "../providers/hash/IHashProvider";

class CreateUserService {
  databaseProvider: IDatabaseProvider;
  hashProvider: IHashProvider;

  constructor(
    databaseProvider: IDatabaseProvider,
    hashProvider: IHashProvider,
  ) {
    this.databaseProvider = databaseProvider;
    this.hashProvider = hashProvider;
  }

  async execute(input: ICreateUserInput) {
    const exists = this.databaseProvider.findOneByField(
      "users",
      "email",
      input.email,
    );

    if (exists) {
      throw new Error("user with same email already registered");
    }

    const data: ICreateUserData = {
      email: input.email,
      password: await this.hashProvider.hash(input.password),
      created_at: (Date.now() / 1000) >> 0,
    };

    this.databaseProvider.insertOne<ICreateUserData>("users", data);
  }
}

export default CreateUserService;
