import { ApolloServer } from "apollo-server";

import resolvers from "@graphql/resolvers";
import typeDefs from "@graphql/schema";
import { IAppProviders } from "@providers/IAppProviders";
import ValidateTokenService from "@users/services/ValidateTokenService";

class App {
  app: ApolloServer;
  providers: IAppProviders;

  constructor(providers: IAppProviders) {
    this.providers = providers;

    this.app = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }) => {
        let userId: string;

        if (req.headers.authorization) {
          const sessionService = new ValidateTokenService(this.providers);
          userId = await sessionService.execute(req.headers.authorization);
        }

        return {
          providers: this.providers,
          userId,
        };
      },
    });
  }

  listen(port: string) {
    this.app.listen({ port }).then(({ url }) => {
      console.log(`Finance server listening at ${url}`);
    });
  }
}

export default App;
