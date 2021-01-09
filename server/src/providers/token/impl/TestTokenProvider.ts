import { ITokenProvider } from "@/providers/Token/ITokenProvider";

class TestTokenProvider implements ITokenProvider {
  length: number;

  constructor(length: number) {
    this.length = length;
  }

  generate() {
    return Array.from({ length: this.length }, () => "t").join("");
  }
}

export default TestTokenProvider;
