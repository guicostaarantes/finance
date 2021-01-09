import { IHashProvider } from "../IHashProvider";

class TestHashProvider implements IHashProvider {
  async hash(value: string) {
    return `hashed:${value}`;
  }

  async compare(value: string, hashedValue: string) {
    return hashedValue === `hashed:${value}`;
  }
}

export default TestHashProvider;
