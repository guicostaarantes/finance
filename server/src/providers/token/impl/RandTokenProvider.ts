import rand from "crypto-random-string";
import { ITokenProvider } from "@/providers/Token/ITokenProvider";

class RandTokenProvider implements ITokenProvider {
  length: number;

  constructor(length: number) {
    this.length = length;
  }

  generate() {
    return rand({ length: this.length, type: "alphanumeric" });
  }
}

export default RandTokenProvider;
