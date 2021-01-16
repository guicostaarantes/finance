import { gql } from "apollo-server";

const schema = gql`
  scalar Date

  input UserData {
    email: String!
    password: String!
  }

  input AuthenticationData {
    email: String!
    password: String!
  }

  input SnapshotData {
    date: Date!
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

  type Authentication {
    token: ID!
    createdAt: Int!
    expiresAt: Int!
  }

  type Snapshot {
    id: ID!
    date: Date!
  }

  type Currency {
    id: ID!
    name: String!
  }

  type CurrencyValue {
    snapshotId: ID!
    currencyId: ID!
    value: Float!
  }

  type Asset {
    id: ID!
    snapshotId: ID!
    name: String!
    value: Float!
    currencyId: ID!
  }

  type Query {
    AuthenticateUser(data: AuthenticationData!): Authentication!
    ListSnapshots: [Snapshot!]!
    GetSnapshot(id: ID!): Snapshot!
    ListCurrencies: [Currency!]!
    GetCurrency(id: ID!): Currency!
    ListCurrencyValuesOfSnapshot(snapshotId: ID!): [CurrencyValue!]!
    GetCurrencyValue(snapshotId: ID!, currencyId: ID!): CurrencyValue!
    ListAssetsOfSnapshot(snapshotId: ID!): [Asset!]!
    GetAsset(id: ID!): Asset!
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
