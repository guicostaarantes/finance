import { GraphQLDate } from "graphql-iso-date";
import { ICreateAssetInput } from "@/modules/assets/entities/IAsset";
import { ICreateCurrencyInput } from "@/modules/assets/entities/ICurrency";
import { ICreateCurrencyValueInput } from "@/modules/assets/entities/ICurrencyValue";
import { ICreateSnapshotInput } from "@/modules/assets/entities/ISnapshot";
import CreateAssetService from "@/modules/assets/services/CreateAssetService";
import CreateCurrencyService from "@/modules/assets/services/CreateCurrencyService";
import CreateCurrencyValueService from "@/modules/assets/services/CreateCurrencyValueService";
import CreateSnapshotService from "@/modules/assets/services/CreateSnapshotService";
import DeleteAssetService from "@/modules/assets/services/DeleteAssetService";
import DeleteCurrencyService from "@/modules/assets/services/DeleteCurrencyService";
import DeleteCurrencyValueService from "@/modules/assets/services/DeleteCurrencyValueService";
import DeleteSnapshotService from "@/modules/assets/services/DeleteSnapshotService";
import UpdateAssetService from "@/modules/assets/services/UpdateAssetService";
import UpdateCurrencyService from "@/modules/assets/services/UpdateCurrencyService";
import UpdateCurrencyValueService from "@/modules/assets/services/UpdateCurrencyValueService";
import UpdateSnapshotService from "@/modules/assets/services/UpdateSnapshotService";
import { IAuthenticateUserInput } from "@/modules/users/entities/IAuth";
import { ICreateUserInput } from "@/modules/users/entities/IUser";
import AuthenticateUserService from "@/modules/users/services/AuthenticateUserService";
import CreateUserService from "@/modules/users/services/CreateUserService";
import { IAppProviders } from "@/providers/IAppProviders";

const resolvers = {
  Date: GraphQLDate,
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
