import { IDatabaseProvider } from "@providers/database/IDatabaseProvider";
import { IErrorProvider } from "@providers/error/IErrorProvider";
import { IHashProvider } from "@providers/hash/IHashProvider";
import { ITokenProvider } from "@providers/token/ITokenProvider";

export interface IAppProviders {
  database: IDatabaseProvider;
  error: IErrorProvider;
  hash: IHashProvider;
  token: ITokenProvider;
}
