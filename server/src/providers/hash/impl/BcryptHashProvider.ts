import { compare as bcompare, hash as bhash } from "bcryptjs";

import { IHashProvider } from "@providers/hash/IHashProvider";

class BcryptHashProvider implements IHashProvider {
  salt: number;

  constructor(salt: number) {
    this.salt = salt;
  }

  hash(value: string) {
    return bhash(value, this.salt);
  }

  compare(value: string, hashedValue: string) {
    return bcompare(value, hashedValue);
  }
}

export default BcryptHashProvider;
