import { GraphQLDate } from "graphql-iso-date";

import { ICreateAssetInput } from "@assets/entities/IAsset";
import { ICreateCurrencyInput } from "@assets/entities/ICurrency";
import { ICreateCurrencyValueInput } from "@assets/entities/ICurrencyValue";
import { ICreateSnapshotInput } from "@assets/entities/ISnapshot";
import CreateAssetService from "@assets/services/CreateAssetService";
import CreateCurrencyService from "@assets/services/CreateCurrencyService";
import CreateCurrencyValueService from "@assets/services/CreateCurrencyValueService";
import CreateSnapshotService from "@assets/services/CreateSnapshotService";
import DeleteAssetService from "@assets/services/DeleteAssetService";
import DeleteCurrencyService from "@assets/services/DeleteCurrencyService";
import DeleteCurrencyValueService from "@assets/services/DeleteCurrencyValueService";
import DeleteSnapshotService from "@assets/services/DeleteSnapshotService";
import GetAssetService from "@assets/services/GetAssetService";
import GetCurrencyService from "@assets/services/GetCurrencyService";
import GetCurrencyValueService from "@assets/services/GetCurrencyValueService";
import GetSnapshotService from "@assets/services/GetSnapshotService";
import GetSnapshotTotalAmountService from "@assets/services/GetSnapshotTotalAmountService";
import ListAssetsOfSnapshotService from "@assets/services/ListAssetsOfSnapshotService";
import ListCurrenciesService from "@assets/services/ListCurrenciesService";
import ListCurrencyValuesOfSnapshotService from "@assets/services/ListCurrencyValuesOfSnapshotService";
import ListSnapshotsService from "@assets/services/ListSnapshotsService";
import UpdateAssetService from "@assets/services/UpdateAssetService";
import UpdateCurrencyService from "@assets/services/UpdateCurrencyService";
import UpdateCurrencyValueService from "@assets/services/UpdateCurrencyValueService";
import UpdateSnapshotService from "@assets/services/UpdateSnapshotService";
import { IAppProviders } from "@providers/IAppProviders";
import { IAuthenticateUserInput } from "@users/entities/IAuth";
import { ICreateUserInput } from "@users/entities/IUser";
import AuthenticateUserService from "@users/services/AuthenticateUserService";
import CreateUserService from "@users/services/CreateUserService";

const resolvers = {
  Date: GraphQLDate,
  CurrencyValue: {
    snapshot: async (
      parent: { snapshotId: string },
      _args: any,
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetSnapshotService(context.providers);
      return await service.execute(context.userId, parent.snapshotId);
    },
    currency: async (
      parent: { currencyId: string },
      _args: any,
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetCurrencyService(context.providers);
      return await service.execute(context.userId, parent.currencyId);
    },
  },
  Asset: {
    snapshot: async (
      parent: { snapshotId: string },
      _args: any,
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetSnapshotService(context.providers);
      return await service.execute(context.userId, parent.snapshotId);
    },
    currency: async (
      parent: { currencyId: string },
      _args: any,
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetCurrencyService(context.providers);
      return await service.execute(context.userId, parent.currencyId);
    },
  },
  Snapshot: {
    total: async (
      parent: { id: string },
      args: { currencyId: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetSnapshotTotalAmountService(context.providers);
      return await service.execute(context.userId, parent.id, args.currencyId);
    },
  },
  Query: {
    AuthenticateUser: async (
      _parent: any,
      args: { data: IAuthenticateUserInput },
      context: { providers: IAppProviders },
      _info: any,
    ) => {
      const service = new AuthenticateUserService(context.providers);
      return await service.execute(args.data);
    },
    ListSnapshots: async (
      _parent: any,
      _args: any,
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new ListSnapshotsService(context.providers);
      return await service.execute(context.userId);
    },
    GetSnapshot: async (
      _parent: any,
      args: { id: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetSnapshotService(context.providers);
      return await service.execute(context.userId, args.id);
    },
    ListCurrencies: async (
      _parent: any,
      _args: any,
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new ListCurrenciesService(context.providers);
      return await service.execute(context.userId);
    },
    GetCurrency: async (
      _parent: any,
      args: { id: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetCurrencyService(context.providers);
      return await service.execute(context.userId, args.id);
    },
    ListCurrencyValuesOfSnapshot: async (
      _parent: any,
      args: { snapshotId: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new ListCurrencyValuesOfSnapshotService(
        context.providers,
      );
      return await service.execute(context.userId, args.snapshotId);
    },
    GetCurrencyValue: async (
      _parent: any,
      args: { snapshotId: string; currencyId: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetCurrencyValueService(context.providers);
      return await service.execute(
        context.userId,
        args.snapshotId,
        args.currencyId,
      );
    },
    ListAssetsOfSnapshot: async (
      _parent: any,
      args: { snapshotId: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new ListAssetsOfSnapshotService(context.providers);
      return await service.execute(context.userId, args.snapshotId);
    },
    GetAsset: async (
      _parent: any,
      args: { id: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new GetAssetService(context.providers);
      return await service.execute(context.userId, args.id);
    },
  },
  Mutation: {
    CreateUser: async (
      _parent: any,
      args: { data: ICreateUserInput },
      context: { providers: IAppProviders },
      _info: any,
    ) => {
      const service = new CreateUserService(context.providers);
      await service.execute(args.data);
    },
    CreateSnapshot: async (
      _parent: any,
      args: { data: ICreateSnapshotInput },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new CreateSnapshotService(context.providers);
      await service.execute(context.userId, args.data);
    },
    UpdateSnapshot: async (
      _parent: any,
      args: { id: string; data: ICreateSnapshotInput },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new UpdateSnapshotService(context.providers);
      await service.execute(context.userId, args.id, args.data);
    },
    DeleteSnapshot: async (
      _parent: any,
      args: { id: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new DeleteSnapshotService(context.providers);
      await service.execute(context.userId, args.id);
    },
    CreateCurrency: async (
      _parent: any,
      args: { data: ICreateCurrencyInput },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new CreateCurrencyService(context.providers);
      await service.execute(context.userId, args.data);
    },
    UpdateCurrency: async (
      _parent: any,
      args: { id: string; data: ICreateCurrencyInput },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new UpdateCurrencyService(context.providers);
      await service.execute(context.userId, args.id, args.data);
    },
    DeleteCurrency: async (
      _parent: any,
      args: { id: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new DeleteCurrencyService(context.providers);
      await service.execute(context.userId, args.id);
    },
    CreateCurrencyValue: async (
      _parent: any,
      args: {
        snapshotId: string;
        currencyId: string;
        data: ICreateCurrencyValueInput;
      },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new CreateCurrencyValueService(context.providers);
      await service.execute(
        context.userId,
        args.snapshotId,
        args.currencyId,
        args.data,
      );
    },
    UpdateCurrencyValue: async (
      _parent: any,
      args: {
        snapshotId: string;
        currencyId: string;
        data: ICreateCurrencyValueInput;
      },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new UpdateCurrencyValueService(context.providers);
      await service.execute(
        context.userId,
        args.snapshotId,
        args.currencyId,
        args.data,
      );
    },
    DeleteCurrencyValue: async (
      _parent: any,
      args: { snapshotId: string; currencyId: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new DeleteCurrencyValueService(context.providers);
      await service.execute(context.userId, args.snapshotId, args.currencyId);
    },
    CreateAsset: async (
      _parent: any,
      args: { data: ICreateAssetInput },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new CreateAssetService(context.providers);
      await service.execute(context.userId, args.data);
    },
    UpdateAsset: async (
      _parent: any,
      args: { id: string; data: ICreateAssetInput },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new UpdateAssetService(context.providers);
      await service.execute(context.userId, args.id, args.data);
    },
    DeleteAsset: async (
      _parent: any,
      args: { id: string },
      context: { providers: IAppProviders; userId: string },
      _info: any,
    ) => {
      const service = new DeleteAssetService(context.providers);
      await service.execute(context.userId, args.id);
    },
  },
};

export default resolvers;
