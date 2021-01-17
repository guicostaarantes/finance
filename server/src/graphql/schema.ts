import { gql } from 'apollo-server';

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
    price: Float!
  }

  input AssetData {
    name: String!
    snapshotId: ID!
    currencyId: ID!
    amount: Float!
  }

  type Authentication {
    token: ID!
    createdAt: Int!
    expiresAt: Int!
  }

  type Snapshot {
    id: ID!
    date: Date!
    total(currencyId: ID!): Float!
  }

  type Currency {
    id: ID!
    name: String!
  }

  type CurrencyValue {
    snapshotId: ID!
    snapshot: Snapshot!
    currencyId: ID!
    currency: Currency!
    price: Float!
  }

  type Asset {
    id: ID!
    name: String!
    snapshotId: ID!
    snapshot: Snapshot!
    currencyId: ID!
    currency: Currency!
    amount: Float!
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
