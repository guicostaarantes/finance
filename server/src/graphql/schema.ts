import { gql } from "apollo-server";

const schema = gql`
  input UserData {
    email: String!
    password: String!
  }

  input AuthenticationData {
    email: String!
    password: String!
  }

  input SnapshotData {
    date: Int!
  }

  input CurrencyData {
    name: String!
  }

  input CurrencyValueData {
    value: Float!
  }

  input AssetData {
    snapshotId: ID!
    name: String!
    value: Float!
    currencyId: ID!
  }

  type AuthenticateUser {
    token: ID!
    createdAt: Int!
    expiresAt: Int!
  }

  type Query {
    AuthenticateUser(data: AuthenticationData!): AuthenticateUser!
  }

  type Mutation {
    CreateUser(data: UserData!): Boolean
    CreateSnapshot(data: SnapshotData!): Boolean
    UpdateSnapshot(id: ID!, data: SnapshotData!): Boolean
    DeleteSnapshot(id: ID!): Boolean
    CreateCurrency(data: CurrencyData!): Boolean
    UpdateCurrency(id: ID!, data: CurrencyData!): Boolean
    DeleteCurrency(id: ID!): Boolean
    CreateCurrencyValue(
      snapshotId: ID!
      currencyId: ID!
      data: CurrencyValueData!
    ): Boolean
    UpdateCurrencyValue(
      snapshotId: ID!
      currencyId: ID!
      data: CurrencyValueData!
    ): Boolean
    DeleteCurrencyValue(snapshotId: ID!, currencyId: ID!): Boolean
    CreateAsset(data: AssetData!): Boolean
    UpdateAsset(id: ID!, data: AssetData!): Boolean
    DeleteAsset(id: ID!): Boolean
  }
`;

export default schema;
