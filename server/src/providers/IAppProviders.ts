import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IHashProvider } from "@/providers/hash/IHashProvider";

export interface IAppProviders {
  database: IDatabaseProvider;
  hash: IHashProvider;
}
