import { IDatabaseProvider } from "@/providers/database/IDatabaseProvider";
import { IHashProvider } from "@/providers/hash/IHashProvider";
import { ITokenProvider } from "@/providers/Token/ITokenProvider";

export interface IAppProviders {
  database: IDatabaseProvider;
  hash: IHashProvider;
  token: ITokenProvider;
}
