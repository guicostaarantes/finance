import { IDatabaseProvider } from "./database/IDatabaseProvider";
import { IHashProvider } from "./hash/IHashProvider";

export interface IAppProviders {
  database: IDatabaseProvider;
  hash: IHashProvider;
}
