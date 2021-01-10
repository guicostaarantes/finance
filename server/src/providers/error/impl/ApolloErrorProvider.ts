import { ApolloError } from "apollo-server";
import { IErrorProvider } from "../IErrorProvider";

class ApolloErrorProvider implements IErrorProvider {
  throw(message: string, code: string) {
    throw new ApolloError(message, code);
  }
}

export default ApolloErrorProvider;
