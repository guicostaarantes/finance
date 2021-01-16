export interface IAsset {
  id: string;
  snapshotId: string;
  name: string;
  amount: number;
  currencyId: string;
}

export interface ICreateAssetInput {
  snapshotId: string;
  name: string;
  amount: number;
  currencyId: string;
}

export interface ICreateAssetData {
  snapshotId: string;
  name: string;
  amount: number;
  currencyId: string;
}
