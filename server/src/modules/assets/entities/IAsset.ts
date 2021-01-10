export interface IAsset {
  id: string;
  snapshot_id: string;
  name: string;
  value: number;
  currency_id: string;
}

export interface ICreateAssetInput {
  snapshot_id: string;
  name: string;
  value: number;
  currency_id: string;
}

export interface ICreateAssetData {
  snapshot_id: string;
  name: string;
  value: number;
  currency_id: string;
}
