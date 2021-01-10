import {
  ICreateUserData,
  ICreateUserInput,
} from "@/modules/users/entities/IUser";
import AppError from "@/modules/errors/AppError";
import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IHashProvider } from "@/providers/hash/IHashProvider";

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
    const exists = this.databaseProvider.findOne("users", [
      { field: "email", compare: "=", value: input.email },
    ]);

    if (exists) {
      throw new AppError("User with same email already registered", 409);
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
